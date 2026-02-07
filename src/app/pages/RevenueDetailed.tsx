import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from 'lucide-react';
import { Card } from '../components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ordersApi, productsApi } from '../services/api';
import { initialOrders, initialProducts, type Order, type Product } from '../data/dashboardData';
import { toast } from 'sonner';

export function RevenueDetailed() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, productsData] = await Promise.all([
        ordersApi.getAll(),
        productsApi.getAll()
      ]);
      
      // Fallback to initial data if API returns empty (for demo purposes)
      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);
      } else {
        console.log('No orders from API, using initial data');
        setOrders(initialOrders);
      }

      if (productsData && productsData.length > 0) {
        setProducts(productsData);
      } else {
        console.log('No products from API, using initial data');
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('Failed to load revenue data:', error);
      toast.error('Using offline data due to load failure');
      setOrders(initialOrders);
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = () => {
    let totalRevenue = 0;
    let totalCost = 0;

    orders.forEach((order: any) => {
      // Handle potential property inconsistencies
      const orderTotal = order.totalAmount ?? order.total ?? 0;
      totalRevenue += orderTotal;

      // Calculate cost for each item to determine profit
      if (order.items) {
        order.items.forEach((item: any) => {
          const product = products.find(p => p.id === item.productId);
          if (product && product.costPrice) {
            totalCost += product.costPrice * item.quantity;
          } else {
            // Fallback if cost price is missing: assume 20% profit margin
            totalCost += (item.price || 0) * item.quantity * 0.8;
          }
        });
      }
    });

    const totalProfit = totalRevenue - totalCost;
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    return {
      totalRevenue,
      averageOrderValue,
      totalProfit,
      orderCount: orders.length
    };
  };

  const getChartData = () => {
    const dataMap = new Map<string, number>();
    
    // Filter orders based on time range
    const now = new Date();
    const filteredOrders = orders.filter((order: any) => {
      const dateStr = order.createdAt || order.date || new Date().toISOString();
      const orderDate = new Date(dateStr);
      
      if (timeRange === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= oneWeekAgo;
      } else if (timeRange === 'month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return orderDate >= oneMonthAgo;
      } else {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return orderDate >= oneYearAgo;
      }
    });

    filteredOrders.forEach((order: any) => {
      const dateStr = order.createdAt || order.date || new Date().toISOString();
      const date = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const orderTotal = order.totalAmount ?? order.total ?? 0;
      dataMap.set(date, (dataMap.get(date) || 0) + orderTotal);
    });

    return Array.from(dataMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPaymentMethods = () => {
    const methods = new Map<string, number>();
    
    orders.forEach((order: any) => {
      const orderTotal = order.totalAmount ?? order.total ?? 0;
      
      if (order.paymentBreakup && order.paymentBreakup.length > 0) {
        order.paymentBreakup.forEach((payment: any) => {
          methods.set(payment.method, (methods.get(payment.method) || 0) + payment.amount);
        });
      } else {
        // Default to CASH if no breakdown available
        methods.set('CASH', (methods.get('CASH') || 0) + orderTotal);
      }
    });

    const total = Array.from(methods.values()).reduce((sum, val) => sum + val, 0);
    const colors = {
      'CASH': 'bg-green-500',
      'UPI': 'bg-blue-500',
      'CARD': 'bg-purple-500',
      'CREDIT': 'bg-orange-500',
      'DEFAULT': 'bg-gray-500'
    };

    return Array.from(methods.entries()).map(([method, amount]) => ({
      method,
      amount,
      color: colors[method as keyof typeof colors] || colors.DEFAULT
    })).sort((a, b) => b.amount - a.amount);
  };

  const metrics = calculateMetrics();
  const chartData = getChartData();
  const paymentMethods = getPaymentMethods();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC] p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          
          <p className="text-gray-500">Comprehensive breakdown of your sales and earnings</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                timeRange === range
                  ? 'bg-[#0F4C81] text-white shadow'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +12.5%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h3 className="text-2xl font-bold text-[#082032] mt-1">₹{metrics.totalRevenue.toLocaleString()}</h3>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Wallet size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +8.2%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Net Profit (Est.)</p>
          <h3 className="text-2xl font-bold text-[#082032] mt-1">₹{metrics.totalProfit.toLocaleString()}</h3>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <CreditCard size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +5.3%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Avg. Order Value</p>
          <h3 className="text-2xl font-bold text-[#082032] mt-1">₹{metrics.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Calendar size={24} />
            </div>
            <span className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +24%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
          <h3 className="text-2xl font-bold text-[#082032] mt-1">{metrics.orderCount}</h3>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#082032]">Revenue Trend</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#0F4C81" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#082032]">Payment Methods</h3>
          </div>
          <div className="space-y-4">
             {paymentMethods.length > 0 ? (
               paymentMethods.map((item) => (
                 <div key={item.method} className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span className="font-medium text-gray-600">{item.method}</span>
                     <span className="font-bold text-[#082032]">₹{item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                   </div>
                   <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div 
                       className={`h-full ${item.color} rounded-full`} 
                       style={{ width: `${metrics.totalRevenue > 0 ? (item.amount / metrics.totalRevenue) * 100 : 0}%` }}
                     />
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-8 text-gray-500">No payment data available</div>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
}
