import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  IndianRupee, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  Plus,
  ArrowUp,
  ArrowDown,
  ChartLine,
  CircleAlert,
  PackagePlus
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  productsApi, 
  customersApi, 
  ordersApi,
  revenueSourcesApi
} from '../services/api';
import type { Product, Customer, Order, RevenueSource } from '../data/dashboardData';
import { useAuth } from '../contexts/AuthContext';
import { 
  calculateDashboardMetrics, 
  getLowStockProducts, 
  getTopProductsBySales,
  getRecentOrders,
  getExpiringProducts,
  initialSalesData
} from '../data/dashboardData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueAnalysisDialog } from '../components/dashboard/RevenueAnalysisDialog';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false);

  // Load data from backend on mount
  useEffect(() => {
    let isMounted = true; // Cleanup flag
    
    loadDashboardData();
    
    return () => {
      isMounted = false; // Cleanup on unmount
    };
    
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        console.log('Loading dashboard data from backend...');

        // Fetch all data in parallel
        const [productsData, customersData, ordersData, revenueSourcesData] = await Promise.all([
          productsApi.getAll(),
          customersApi.getAll(),
          ordersApi.getAll(),
          revenueSourcesApi.getAll(),
        ]);

        if (isMounted) {
          setProducts(productsData);
          setCustomers(customersData);
          setOrders(ordersData);
          setRevenueSources(revenueSourcesData);

          const totalItems = productsData.length + customersData.length + ordersData.length;
          
          if (totalItems === 0) {
            toast.success('Welcome! Start by adding your first product to get started.');
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (isMounted) {
          toast.error(`Failed to load dashboard data: ${errorMessage}`);
          
          setProducts([]);
          setCustomers([]);
          setOrders([]);
          setRevenueSources([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
  }, []);



  // Computed data
  const dashboardMetrics = calculateDashboardMetrics(products, orders, customers, revenueSources);
  const lowStockAlerts = getLowStockProducts(products);
  const expiringProducts = getExpiringProducts(products);
  const topProductsSales = getTopProductsBySales(products, 4);
  const recentOrders = getRecentOrders(orders, 5);

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Revenue',
      value: `₹${(dashboardMetrics.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: `${dashboardMetrics.revenueTrend === 'up' ? '+' : '-'}${dashboardMetrics.revenueChange || 0}%`,
      trend: dashboardMetrics.revenueTrend,
      icon: IndianRupee,
    },
    {
      title: 'Orders',
      value: (dashboardMetrics.totalOrders || 0).toLocaleString('en-IN'),
      change: `${dashboardMetrics.ordersTrend === 'up' ? '+' : '-'}${dashboardMetrics.ordersChange || 0}%`,
      trend: dashboardMetrics.ordersTrend,
      icon: ShoppingCart,
    },
    {
      title: 'Products',
      value: (dashboardMetrics.totalProducts || 0).toLocaleString('en-IN'),
      change: `${dashboardMetrics.productsTrend === 'up' ? '+' : '-'}${dashboardMetrics.productsChange || 0}%`,
      trend: dashboardMetrics.productsTrend,
      icon: Package,
    },
    {
      title: 'Customers',
      value: (dashboardMetrics.totalCustomers || 0).toLocaleString('en-IN'),
      change: `${dashboardMetrics.customersTrend === 'up' ? '+' : '-'}${dashboardMetrics.customersChange || 0}%`,
      trend: dashboardMetrics.customersTrend,
      icon: Users,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0F4C81] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0F4C81]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C81] mb-2 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 font-medium">Welcome back, {user?.name || 'User'}! Here's your business overview.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/dashboard/inventory')} 
              className="bg-[#0F4C81] hover:bg-[#0d3f6a] shadow-lg hover:shadow-[#0F4C81]/20 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((metric, index) => {
            // Determine click handler based on title
            let clickHandler;
            if (metric.title === 'Total Revenue') {
              clickHandler = () => setIsRevenueDialogOpen(true);
            } else if (metric.title === 'Orders') {
              clickHandler = () => navigate('/dashboard/orders');
            } else if (metric.title === 'Products') {
              clickHandler = () => navigate('/dashboard/inventory');
            } else if (metric.title === 'Customers') {
              clickHandler = () => navigate('/dashboard/customers');
            } else {
              clickHandler = () => navigate('/dashboard');
            }

            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={clickHandler}
                className="cursor-pointer group"
              >
                <Card className="relative overflow-hidden p-6 bg-white/80 backdrop-blur-md border border-[#0F4C81]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                     <metric.icon className="w-24 h-24 text-[#0F4C81] -mr-8 -mt-8" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#0F4C81]/5 rounded-xl group-hover:bg-[#0F4C81]/10 transition-colors">
                            <metric.icon className="w-6 h-6 text-[#0F4C81]" />
                        </div>
                         <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${metric.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {metric.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {metric.change}
                         </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{metric.title}</p>
                        <h3 className="text-2xl font-bold text-[#0F4C81]">{metric.value}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart - Takes up 2 columns */}
          <Card className="lg:col-span-2 p-6 bg-white/80 backdrop-blur-md border border-[#0F4C81]/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#0F4C81]/5 rounded-lg">
                    <ChartLine className="w-5 h-5 text-[#0F4C81]" />
                </div>
                <h3 className="font-semibold text-[#0F4C81]">Sales Overview</h3>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-[#0F4C81] hover:bg-[#0F4C81]/10 hover:text-[#0F4C81]"
                onClick={() => setIsRevenueDialogOpen(true)}
              >
                <CircleAlert className="w-4 h-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={initialSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#0F4C81'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0F4C81" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Low Stock Alerts and Expiring Products - Takes up 1 column */}
          <div className="flex flex-col gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-md border border-[#0F4C81]/10 shadow-sm flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-50 rounded-lg">
                          <CircleAlert className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-[#0F4C81]">Low Stock</h3>
                  </div>
                {lowStockAlerts.length > 0 && (
                  <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {lowStockAlerts.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {lowStockAlerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-gray-900 font-medium">All Stocked Up!</p>
                    <p className="text-sm text-gray-500 mt-1">Inventory levels are looking good.</p>
                  </div>
                ) : (
                  lowStockAlerts.map((product) => (
                    <div key={product.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0F4C81] mb-1">{product.productName}</p>
                        <p className="text-xs text-red-600 font-medium">Only {product.currentStock} left</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-[#0F4C81] hover:bg-[#0F4C81]/10 hover:text-[#0F4C81]"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/dashboard/inventory');
                        }}
                      >
                        <PackagePlus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Expiring Products */}
            <Card className="p-6 bg-white/80 backdrop-blur-md border border-[#0F4C81]/10 shadow-sm flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-50 rounded-lg">
                          <CircleAlert className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-[#0F4C81]">Expiring Soon</h3>
                  </div>
                {expiringProducts.length > 0 && (
                  <span className="bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {expiringProducts.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {expiringProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-gray-900 font-medium">Fresh Stock!</p>
                    <p className="text-sm text-gray-500 mt-1">No products expiring within 7 days.</p>
                  </div>
                ) : (
                  expiringProducts.map((product) => (
                    <div key={product.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0F4C81] mb-1">{product.productName}</p>
                        <p className={`text-xs font-medium ${product.status === 'expired' ? 'text-red-600' : 'text-orange-600'}`}>
                          {product.status === 'expired' 
                            ? `Expired ${Math.abs(product.daysRemaining)} days ago` 
                            : `Expires in ${product.daysRemaining} days`}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-[#0F4C81] hover:bg-[#0F4C81]/10 hover:text-[#0F4C81]"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/inventory/${product.productId}`);
                        }}
                      >
                        <ArrowUp className="w-4 h-4 rotate-45" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="p-6 bg-white/80 backdrop-blur-md border border-[#0F4C81]/10 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <div className="p-2 bg-[#0F4C81]/5 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#0F4C81]" />
               </div>
              <h3 className="font-semibold text-[#0F4C81]">Top Performing Products</h3>
            </div>
            <div className="space-y-4">
              {topProductsSales.length === 0 ? (
                <div className="text-center py-12">
                   <p className="text-gray-500">No sales data available yet.</p>
                </div>
              ) : (
                topProductsSales.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 hover:bg-[#0F4C81]/5 rounded-xl transition-colors group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-[#0F4C81]/10 text-[#0F4C81]'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F4C81] group-hover:text-[#0F4C81]">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                         <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                            {product.stock} in stock
                         </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6 bg-white/80 backdrop-blur-md border border-[#0F4C81]/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#0F4C81]/5 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-[#0F4C81]" />
                  </div>
                  <h3 className="font-semibold text-[#0F4C81]">Recent Orders</h3>
               </div>
               <Button variant="ghost" size="sm" className="text-xs text-[#0F4C81] hover:text-[#0d3f6a]" onClick={() => navigate('/dashboard/orders')}>
                   View All
               </Button>
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                   <p className="text-gray-500">No orders received yet.</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#0F4C81]/5 rounded-xl transition-colors cursor-pointer" onClick={() => navigate('/dashboard/orders')}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-[#0F4C81]">{order.customer}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{order.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-sm font-bold text-[#0F4C81]">{order.amount}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
      <RevenueAnalysisDialog
        isOpen={isRevenueDialogOpen}
        onClose={() => setIsRevenueDialogOpen(false)}
        products={products}
        orders={orders}
      />
    </div>
  );
}