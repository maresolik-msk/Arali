import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChartLine, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Card } from '../components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { productsApi, ordersApi, customersApi } from '../services/api';
import type { Product, Order, Customer } from '../data/dashboardData';
import { toast } from 'sonner';

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

interface CategoryData {
  name: string;
  value: number;
  revenue: number;
  color: string;
}

interface AnalyticsMetrics {
  avgOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
}

export function Analytics() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    avgOrderValue: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    pendingOrdersCount: 0,
    completedOrdersCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, ordersData] = await Promise.all([
        productsApi.getAll(),
        ordersApi.getAll(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setCustomers([]); // Customers feature disabled for now

      // Calculate metrics
      calculateMetrics(productsData, ordersData, []);
      calculateMonthlyData(ordersData);
      calculateCategoryData(productsData, ordersData);
    } catch (error: any) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (
    productsData: Product[],
    ordersData: Order[],
    customersData: Customer[]
  ) => {
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = ordersData.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const lowStockCount = productsData.filter(p => p.stock <= p.reorderPoint).length;
    const pendingOrdersCount = ordersData.filter(o => o.status === 'pending').length;
    const completedOrdersCount = ordersData.filter(o => o.status === 'completed').length;

    setMetrics({
      avgOrderValue,
      totalRevenue,
      totalOrders,
      totalProducts: productsData.length,
      totalCustomers: customersData.length,
      lowStockCount,
      pendingOrdersCount,
      completedOrdersCount,
    });
  };

  const calculateMonthlyData = (ordersData: Order[]) => {
    // Get last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Initialize monthly data for last 12 months
    const monthlyMap: { [key: string]: { revenue: number; orders: number } } = {};
    
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      const key = `${months[monthIndex]}-${year}`;
      monthlyMap[key] = { revenue: 0, orders: 0 };
    }

    // Aggregate orders by month
    ordersData.forEach(order => {
      const orderDate = new Date(order.date);
      const monthIndex = orderDate.getMonth();
      const year = orderDate.getFullYear();
      const key = `${months[monthIndex]}-${year}`;
      
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += order.total;
        monthlyMap[key].orders += 1;
      }
    });

    // Convert to array for chart
    const chartData: MonthlyData[] = Object.keys(monthlyMap).map(key => ({
      month: key.split('-')[0],
      revenue: Math.round(monthlyMap[key].revenue),
      orders: monthlyMap[key].orders,
    }));

    setMonthlyData(chartData);
  };

  const calculateCategoryData = (productsData: Product[], ordersData: Order[]) => {
    const categoryMap: { [key: string]: { count: number; revenue: number } } = {};
    
    // Calculate revenue by category from orders
    ordersData.forEach(order => {
      order.items.forEach(item => {
        const product = productsData.find(p => p.id === item.productId);
        if (product) {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = { count: 0, revenue: 0 };
          }
          categoryMap[product.category].count += item.quantity;
          categoryMap[product.category].revenue += item.price * item.quantity;
        }
      });
    });

    // Convert to array and calculate percentages
    const totalRevenue = Object.values(categoryMap).reduce((sum, cat) => sum + cat.revenue, 0);
    
    const colors = ['#0F4C81', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];
    
    const chartData: CategoryData[] = Object.entries(categoryMap)
      .map(([name, data], index) => ({
        name,
        value: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
        revenue: Math.round(data.revenue),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);

    // If no data, show empty state
    if (chartData.length === 0) {
      setCategoryData([
        { name: 'No Data', value: 100, revenue: 0, color: '#E5E7EB' }
      ]);
    } else {
      setCategoryData(chartData);
    }
  };

  // Calculate growth rate (comparing last 2 months)
  const calculateGrowthRate = () => {
    if (monthlyData.length < 2) return 0;
    const lastMonth = monthlyData[monthlyData.length - 1]?.revenue || 0;
    const prevMonth = monthlyData[monthlyData.length - 2]?.revenue || 0;
    if (prevMonth === 0) return 0;
    return ((lastMonth - prevMonth) / prevMonth) * 100;
  };

  // Calculate customer lifetime value
  const calculateCustomerLTV = () => {
    if (customers.length === 0) return 0;
    return metrics.totalRevenue / customers.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const growthRate = calculateGrowthRate();
  const customerLTV = calculateCustomerLTV();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      <motion.div
        className="p-6 md:p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div>
          <h1 className="text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your business performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                <DollarSign className="w-6 h-6 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Avg Order Value</p>
                <h3 className="text-foreground">₹{metrics.avgOrderValue.toFixed(2)}</h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Growth Rate</p>
                <h3 className={`text-foreground ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                </h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Orders</p>
                <h3 className="text-foreground">{metrics.totalOrders}</h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/10">
                <ChartLine className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Customer LTV</p>
                <h3 className="text-foreground">₹{customerLTV.toFixed(0)}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                <DollarSign className="w-6 h-6 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Revenue</p>
                <h3 className="text-foreground">₹{metrics.totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-500/10">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Products</p>
                <h3 className="text-foreground">{metrics.totalProducts}</h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-500/10">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Low Stock Items</p>
                <h3 className="text-foreground">{metrics.lowStockCount}</h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Pending Orders</p>
                <h3 className="text-foreground">{metrics.pendingOrdersCount}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <h3 className="text-foreground mb-6">Revenue Trend (Last 12 Months)</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0F4C81" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(15, 76, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                      formatter={(value: any) => `₹${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0F4C81" 
                      strokeWidth={3}
                      dot={{ fill: '#0F4C81', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No revenue data available
                </div>
              )}
            </div>
          </Card>

          {/* Sales by Category */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <h3 className="text-foreground mb-6">Sales by Category</h3>
              {categoryData.length > 0 && categoryData[0].name !== 'No Data' ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: any, props: any) => [
                        `₹${props.payload.revenue} (${value}%)`,
                        'Revenue'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No category data available
                </div>
              )}
            </div>
          </Card>

          {/* Monthly Orders */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <h3 className="text-foreground mb-6">Monthly Orders</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0F4C81" opacity={0.1} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#64748B"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(15, 76, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#0F4C81"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No order data available
                </div>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}