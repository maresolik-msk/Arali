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
  initialSalesData
} from '../data/dashboardData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from backend on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

      setProducts(productsData);
      setCustomers(customersData);
      setOrders(ordersData);
      setRevenueSources(revenueSourcesData);

      const totalItems = productsData.length + customersData.length + ordersData.length;
      
      if (totalItems === 0) {
        toast.success('Welcome! Start by adding your first product to get started.');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to load dashboard data: ${errorMessage}`);
      
      setProducts([]);
      setCustomers([]);
      setOrders([]);
      setRevenueSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Computed data
  const dashboardMetrics = calculateDashboardMetrics(products, orders, customers, revenueSources);
  const lowStockAlerts = getLowStockProducts(products);
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[#0F4C81] mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'User'}! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard/inventory')} className="bg-[#0F4C81] hover:bg-[#0d3f6a]">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/50 backdrop-blur-sm border border-[#0F4C81]/20 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                    <h3 className="text-[#0F4C81] mb-2">{metric.value}</h3>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[#0F4C81]/10 rounded-full flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-[#0F4C81]" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card className="p-6 bg-white/50 backdrop-blur-sm border border-[#0F4C81]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChartLine className="w-5 h-5 text-[#0F4C81]" />
                <h3 className="text-[#0F4C81]">Sales Overview</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={initialSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0F4C81" opacity={0.1} />
                <XAxis 
                  dataKey="day" 
                  stroke="#0F4C81"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#0F4C81"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #0F4C81',
                    borderRadius: '8px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0F4C81" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="p-6 bg-white/50 backdrop-blur-sm border border-[#0F4C81]/20">
            <div className="flex items-center gap-2 mb-4">
              <CircleAlert className="w-5 h-5 text-red-600" />
              <h3 className="text-[#0F4C81]">Low Stock Alerts</h3>
              {lowStockAlerts.length > 0 && (
                <span className="ml-auto bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  {lowStockAlerts.length}
                </span>
              )}
            </div>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {lowStockAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">All products are well stocked!</p>
                </div>
              ) : (
                lowStockAlerts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="text-sm text-[#0F4C81]">{product.productName}</p>
                      <p className="text-xs text-gray-600">Stock: {product.currentStock} units</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#0F4C81] hover:bg-[#0d3f6a]"
                      onClick={() => navigate('/dashboard/inventory')}
                    >
                      <PackagePlus className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="p-6 bg-white/50 backdrop-blur-sm border border-[#0F4C81]/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#0F4C81]" />
              <h3 className="text-[#0F4C81]">Top Products</h3>
            </div>
            <div className="space-y-3">
              {topProductsSales.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No products yet</p>
                </div>
              ) : (
                topProductsSales.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[#0F4C81] text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm text-[#0F4C81]">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.sold || 0} sold</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{product.stock || 0} in stock</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6 bg-white/50 backdrop-blur-sm border border-[#0F4C81]/20">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-[#0F4C81]" />
              <h3 className="text-[#0F4C81]">Recent Orders</h3>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-[#0F4C81]">{order.customer}</p>
                      <p className="text-xs text-gray-600">
                        {order.items || 0} items • {order.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#0F4C81]">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
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
    </div>
  );
}