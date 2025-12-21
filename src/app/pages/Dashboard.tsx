import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  CircleAlert,
  ChartLine,
  PackagePlus,
  Plus
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  initialProducts,
  initialCustomers,
  initialOrders,
  initialRevenueSources,
  initialSalesData,
  getLowStockProducts,
  getTopProductsByRevenue,
  getTopProductsBySales,
  getOrdersByStatus,
  getRecentOrders,
  getProductCategories,
  getProductsStats,
  getCustomerSegments,
  getTopCustomers,
  getCustomersStats,
  calculateDashboardMetrics,
  restockProduct,
  type Product,
  type Customer,
  type Order,
  type RevenueSource,
} from '../data/dashboardData';
import { productsApi, customersApi, ordersApi, revenueSourcesApi, initApi } from '../services/api';
import { shopSettingsApi, type ShopSettings } from '../services/api';

// Mock data for the dashboard
const metrics = [
  {
    title: 'Total Revenue',
    value: '₹45,231',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: '#0F4C81',
  },
  {
    title: 'Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: '#0F4C81',
  },
  {
    title: 'Products',
    value: '456',
    change: '-2.3%',
    trend: 'down',
    icon: Package,
    color: '#0F4C81',
  },
  {
    title: 'Customers',
    value: '2,845',
    change: '+15.4%',
    trend: 'up',
    icon: Users,
    color: '#0F4C81',
  },
];

const lowStockItems = [
  { id: 1, name: 'Organic Coffee Beans', stock: 12, threshold: 50 },
  { id: 2, name: 'Almond Milk', stock: 8, threshold: 30 },
  { id: 3, name: 'Whole Wheat Bread', stock: 5, threshold: 25 },
  { id: 4, name: 'Fresh Spinach', stock: 15, threshold: 40 },
];

const topProducts = [
  { name: 'Organic Coffee Beans', revenue: '₹8,450', units: 340 },
  { name: 'Greek Yogurt', revenue: '₹5,230', units: 1050 },
  { name: 'Olive Oil', revenue: '₹4,890', units: 306 },
  { name: 'Brown Rice', revenue: '₹3,120', units: 347 },
];

const revenueBreakdown = [
  { category: 'Product Sales', amount: '₹32,450', percentage: 71.8, change: '+15.2%', trend: 'up' },
  { category: 'Service Fees', amount: '₹8,921', percentage: 19.7, change: '+8.4%', trend: 'up' },
  { category: 'Subscriptions', amount: '₹3,860', percentage: 8.5, change: '+5.1%', trend: 'up' },
];

const ordersData = {
  total: 1234,
  completed: 892,
  processing: 215,
  pending: 127,
  byStatus: [
    { status: 'Completed', count: 892, percentage: 72.3, color: '#10B981' },
    { status: 'Processing', count: 215, percentage: 17.4, color: '#3B82F6' },
    { status: 'Pending', count: 127, percentage: 10.3, color: '#F59E0B' },
  ],
  recentOrders: [
    { id: '#ORD-1234', customer: 'John Smith', amount: '₹156.00', status: 'Completed', time: '2 min ago', items: 3 },
    { id: '#ORD-1233', customer: 'Sarah Johnson', amount: '₹89.50', status: 'Processing', time: '15 min ago', items: 2 },
    { id: '#ORD-1232', customer: 'Mike Davis', amount: '₹234.00', status: 'Completed', time: '1 hour ago', items: 5 },
    { id: '#ORD-1231', customer: 'Emily Brown', amount: '₹67.25', status: 'Pending', time: '2 hours ago', items: 1 },
    { id: '#ORD-1230', customer: 'David Wilson', amount: '₹189.75', status: 'Completed', time: '3 hours ago', items: 4 },
  ],
};

const productsData = {
  total: 456,
  inStock: 398,
  lowStock: 42,
  outOfStock: 16,
  categories: [
    { name: 'Groceries', count: 156, percentage: 34.2 },
    { name: 'Beverages', count: 89, percentage: 19.5 },
    { name: 'Snacks', count: 78, percentage: 17.1 },
    { name: 'Dairy', count: 67, percentage: 14.7 },
    { name: 'Others', count: 66, percentage: 14.5 },
  ],
  topSelling: [
    { name: 'Organic Coffee Beans', sold: 340, stock: 12, category: 'Beverages' },
    { name: 'Greek Yogurt', sold: 1050, stock: 45, category: 'Dairy' },
    { name: 'Olive Oil', sold: 306, stock: 78, category: 'Groceries' },
    { name: 'Brown Rice', sold: 347, stock: 92, category: 'Groceries' },
  ],
};

const customersData = {
  total: 2845,
  new: 342,
  returning: 2503,
  growth: '+15.4%',
  segments: [
    { type: 'VIP Customers', count: 145, percentage: 5.1, avgSpend: '₹450' },
    { type: 'Regular Customers', count: 1856, percentage: 65.2, avgSpend: '₹125' },
    { type: 'Occasional Customers', count: 844, percentage: 29.7, avgSpend: '₹45' },
  ],
  topCustomers: [
    { name: 'Sarah Martinez', orders: 47, totalSpent: '₹4,567', joinedDate: 'Jan 2024' },
    { name: 'Michael Chen', orders: 39, totalSpent: '₹3,892', joinedDate: 'Feb 2024' },
    { name: 'Emily Rodriguez', orders: 35, totalSpent: '₹3,245', joinedDate: 'Jan 2024' },
    { name: 'James Thompson', orders: 31, totalSpent: '₹2,987', joinedDate: 'Mar 2024' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Dashboard() {
  // State Management using centralized data structures
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([]);
  const [shopName, setShopName] = useState<string>('My Shop');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Dialog states
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false);
  const [isCustomersDialogOpen, setIsCustomersDialogOpen] = useState(false);
  
  const [restockingProduct, setRestockingProduct] = useState<{
    id: number;
    name: string;
    currentStock: number;
    threshold: number;
    quantity: string;
  } | null>(null);

  // Load data from backend on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        console.log('Starting dashboard data load...');
        
        // Fetch all data from backend
        const [productsData, customersData, ordersData, revenueData, shopSettings] = await Promise.all([
          productsApi.getAll().catch(err => {
            console.error('Failed to load products:', err);
            return [];
          }),
          customersApi.getAll().catch(err => {
            console.error('Failed to load customers:', err);
            return [];
          }),
          ordersApi.getAll().catch(err => {
            console.error('Failed to load orders:', err);
            return [];
          }),
          revenueSourcesApi.getAll().catch(err => {
            console.error('Failed to load revenue sources:', err);
            return [];
          }),
          shopSettingsApi.get().catch(err => {
            console.error('Failed to load shop settings:', err);
            return { shopName: 'My Shop', shopAddress: '', contactEmail: '' };
          }),
        ]);

        console.log('Data loaded from backend:', {
          products: productsData?.length || 0,
          customers: customersData?.length || 0,
          orders: ordersData?.length || 0,
          revenueSources: revenueData?.length || 0,
        });

        // Load data from backend (empty arrays for new users)
        setProducts(productsData || []);
        setCustomers(customersData || []);
        setOrders(ordersData || []);
        setRevenueSources(revenueData || []);
        setShopName(shopSettings.shopName || 'My Shop');
        
        const totalItems = (productsData?.length || 0) + (customersData?.length || 0) + (ordersData?.length || 0);
        
        if (totalItems === 0) {
          toast.success('Welcome! Start by adding your first product to get started.');
        } else {
          console.log(`Loaded ${productsData.length} products, ${customersData.length} customers, ${ordersData.length} orders from database`);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to load dashboard data: ${errorMessage}. Please try refreshing the page.`);
        
        // Start with empty data if error
        setProducts([]);
        setCustomers([]);
        setOrders([]);
        setRevenueSources([]);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Reload data when window gains focus (user returns to the tab/app)
    const handleFocus = () => {
      console.log('Window focused - reloading dashboard data...');
      loadDashboardData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Computed data using helper functions
  const dashboardMetrics = calculateDashboardMetrics(products, orders, customers, revenueSources);
  const lowStockAlerts = getLowStockProducts(products);
  const topProductsRevenue = getTopProductsByRevenue(products);
  const topProductsSales = getTopProductsBySales(products);
  const ordersByStatus = getOrdersByStatus(orders);
  const recentOrders = getRecentOrders(orders);
  const productCategories = getProductCategories(products);
  const productsStats = getProductsStats(products);
  const customerSegments = getCustomerSegments(customers);
  const topCustomersList = getTopCustomers(customers);
  const customersStats = getCustomersStats(customers);

  // Metrics data for UI
  const metrics = [
    {
      title: 'Total Revenue',
      value: `₹${dashboardMetrics.totalRevenue.toLocaleString('en-IN')}`,
      change: dashboardMetrics.revenueChange,
      trend: dashboardMetrics.revenueTrend,
      icon: DollarSign,
      color: '#0F4C81',
    },
    {
      title: 'Orders',
      value: dashboardMetrics.totalOrders.toLocaleString('en-IN'),
      change: dashboardMetrics.ordersChange,
      trend: dashboardMetrics.ordersTrend,
      icon: ShoppingCart,
      color: '#0F4C81',
    },
    {
      title: 'Products',
      value: dashboardMetrics.totalProducts.toString(),
      change: dashboardMetrics.productsChange,
      trend: dashboardMetrics.productsTrend,
      icon: Package,
      color: '#0F4C81',
    },
    {
      title: 'Customers',
      value: dashboardMetrics.totalCustomers.toLocaleString('en-IN'),
      change: dashboardMetrics.customersChange,
      trend: dashboardMetrics.customersTrend,
      icon: Users,
      color: '#0F4C81',
    },
  ];

  const handleRestockClick = (alert: any) => {
    setRestockingProduct({
      id: alert.productId,
      name: alert.productName,
      currentStock: alert.currentStock,
      threshold: alert.threshold,
      quantity: '',
    });
    setIsRestockDialogOpen(true);
  };

  const handleRestockProduct = async () => {
    if (!restockingProduct) return;

    // Validate form
    if (!restockingProduct.quantity) {
      toast.error('Please enter a valid restock quantity');
      return;
    }

    // Validate stock is a valid number
    const stockNum = parseInt(restockingProduct.quantity);
    if (isNaN(stockNum) || stockNum <= 0) {
      toast.error('Please enter a valid restock quantity');
      return;
    }

    try {
      // Update product in backend
      const updatedProduct = await productsApi.restock(restockingProduct.id, stockNum);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === restockingProduct.id ? updatedProduct : p
      ));

      // Close dialog and reset
      setIsRestockDialogOpen(false);
      setRestockingProduct(null);

      // Show success message
      toast.success(`Successfully restocked ${stockNum} units of ${restockingProduct.name}!`);
    } catch (error) {
      console.error('Error restocking product:', error);
      toast.error('Failed to restock product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      <motion.div
        className="p-6 md:p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-foreground">{shopName} - Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            const isRevenue = metric.title === 'Total Revenue';
            const isOrders = metric.title === 'Orders';
            const isProducts = metric.title === 'Products';
            const isCustomers = metric.title === 'Customers';
            const isClickable = isRevenue || isOrders || isProducts || isCustomers;
            
            const handleClick = () => {
              if (isRevenue) setIsRevenueDialogOpen(true);
              else if (isOrders) setIsOrdersDialogOpen(true);
              else if (isProducts) setIsProductsDialogOpen(true);
              else if (isCustomers) setIsCustomersDialogOpen(true);
            };
            
            return (
              <motion.div
                key={metric.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                className={isClickable ? 'cursor-pointer' : ''}
              >
                <Card className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  
                  <div className="relative p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                        <Icon className="w-6 h-6 text-[#0F4C81]" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendIcon className="w-4 h-4" />
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">{metric.title}</p>
                      <h3 className="text-foreground">{metric.value}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-foreground mb-1">Weekly Sales</h3>
                    <p className="text-muted-foreground">Revenue overview for this week</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0F4C81]/5">
                    <ChartLine className="w-5 h-5 text-[#0F4C81]" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={initialSalesData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0F4C81" opacity={0.1} />
                    <XAxis 
                      dataKey="day" 
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
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#0F4C81" 
                      strokeWidth={3}
                      fill="url(#salesGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-foreground mb-1">Low Stock Alerts</h3>
                    <p className="text-muted-foreground">Items needing restocking</p>
                  </div>
                  <div className="p-2 rounded-xl bg-red-500/10">
                    <CircleAlert className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  {lowStockAlerts.map((alert) => (
                    <div 
                      key={alert.productId}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#0F4C81]/5 to-transparent border border-[#0F4C81]/10 hover:border-[#0F4C81]/20 transition-all"
                    >
                      <div className="flex-1">
                        <p className="text-foreground mb-1">{alert.productName}</p>
                        <p className="text-muted-foreground">
                          {alert.currentStock} units left (threshold: {alert.threshold})
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full"
                        onClick={() => handleRestockClick(alert)}
                      >
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-foreground mb-1">Recent Orders</h3>
                  <p className="text-muted-foreground">Latest transactions from your store</p>
                </div>
                <Link to="/dashboard/orders">
                  <Button 
                    variant="outline"
                    className="border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#0F4C81]/10">
                      <th className="text-left py-3 px-4 text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr 
                        key={order.id}
                        className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-foreground">{order.id}</td>
                        <td className="py-4 px-4 text-foreground">{order.customer}</td>
                        <td className="py-4 px-4 text-foreground">{order.amount}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            order.status === 'Completed' 
                              ? 'bg-green-100 text-green-700' 
                              : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <PackagePlus className="w-5 h-5" />
              Restock Product
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-[#0F4C81]">Product Name</Label>
              <Input 
                id="productName" 
                value={restockingProduct?.name || ''} 
                readOnly
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock" className="text-[#0F4C81]">Current Stock</Label>
                <Input 
                  id="currentStock" 
                  value={restockingProduct?.currentStock.toString() || ''} 
                  readOnly
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold" className="text-[#0F4C81]">Threshold</Label>
                <Input 
                  id="threshold" 
                  value={restockingProduct?.threshold.toString() || ''} 
                  readOnly
                  className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#0F4C81]">Restock Quantity</Label>
              <Input 
                id="quantity" 
                type="number"
                placeholder="0"
                value={restockingProduct?.quantity || ''} 
                onChange={(e) => setRestockingProduct({ ...restockingProduct!, quantity: e.target.value })} 
                className="h-11 bg-[#0F4C81]/5 border-[#0F4C81]/20 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex-1 border-[#0F4C81]/20 text-[#0F4C81] hover:bg-[#0F4C81]/5"
              onClick={() => setIsRestockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={handleRestockProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Restock Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revenue Breakdown Dialog */}
      <Dialog open={isRevenueDialogOpen} onOpenChange={setIsRevenueDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Breakdown
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Total Revenue Summary */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 border border-[#0F4C81]/20">
              <p className="text-muted-foreground mb-2">Total Revenue (This Month)</p>
              <div className="flex items-end gap-3">
                <h2 className="text-[#0F4C81]">₹{dashboardMetrics.totalRevenue.toLocaleString('en-IN')}</h2>
                <div className="flex items-center gap-1 text-green-600 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{dashboardMetrics.revenueChange}</span>
                </div>
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="space-y-4">
              <h3 className="text-foreground">Revenue Sources</h3>
              {revenueSources.map((source) => {
                const TrendIcon = source.trend === 'up' ? TrendingUp : TrendingDown;
                return (
                  <div 
                    key={source.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-[#0F4C81]/5 to-transparent border border-[#0F4C81]/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-foreground mb-1">{source.category}</p>
                        <p className="text-muted-foreground">{source.percentage}% of total revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground mb-1">₹{source.amount.toLocaleString('en-IN')}</p>
                        <div className={`flex items-center gap-1 text-sm justify-end ${
                          source.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendIcon className="w-4 h-4" />
                          <span>{source.change}</span>
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#0F4C81]/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#0F4C81] rounded-full transition-all duration-500"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Products */}
            <div className="space-y-4">
              <h3 className="text-foreground">Top Products by Revenue</h3>
              <div className="space-y-3">
                {topProductsRevenue.map((product, index) => (
                  <div 
                    key={product.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                        <span className="text-[#0F4C81]">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-foreground">{product.name}</p>
                        <p className="text-muted-foreground">{product.units} units sold</p>
                      </div>
                    </div>
                    <p className="text-foreground">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={() => setIsRevenueDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Orders Dialog */}
      <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Orders Overview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Total Orders Summary */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 border border-[#0F4C81]/20">
              <p className="text-muted-foreground mb-2">Total Orders (This Month)</p>
              <div className="flex items-end gap-3">
                <h2 className="text-[#0F4C81]">{dashboardMetrics.totalOrders.toLocaleString('en-IN')}</h2>
                <div className="flex items-center gap-1 text-green-600 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{dashboardMetrics.ordersChange}</span>
                </div>
              </div>
            </div>

            {/* Orders by Status */}
            <div className="space-y-4">
              <h3 className="text-foreground">Orders by Status</h3>
              {ordersByStatus.map((item) => (
                <div 
                  key={item.status}
                  className="p-4 rounded-xl bg-gradient-to-r from-[#0F4C81]/5 to-transparent border border-[#0F4C81]/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-foreground mb-1">{item.status}</p>
                      <p className="text-muted-foreground">{item.percentage}% of total orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground mb-1">{item.count} orders</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#0F4C81]/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="space-y-4">
              <h3 className="text-foreground">Recent Orders</h3>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10"
                  >
                    <div className="flex-1">
                      <p className="text-foreground mb-1">{order.id} - {order.customer}</p>
                      <p className="text-muted-foreground">{order.items} items • {order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground mb-1">{order.amount}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        order.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={() => setIsOrdersDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Products Dialog */}
      <Dialog open={isProductsDialogOpen} onOpenChange={setIsProductsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Package className="w-5 h-5" />
              Products Overview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Total Products Summary */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 border border-[#0F4C81]/20">
              <p className="text-muted-foreground mb-2">Total Products</p>
              <div className="flex items-end gap-3 mb-4">
                <h2 className="text-[#0F4C81]">456</h2>
                <div className="flex items-center gap-1 text-red-600 mb-2">
                  <TrendingDown className="w-5 h-5" />
                  <span>-2.3%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-white/50">
                  <p className="text-muted-foreground mb-1">In Stock</p>
                  <p className="text-foreground">{productsStats.inStock}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-50">
                  <p className="text-muted-foreground mb-1">Low Stock</p>
                  <p className="text-foreground">{productsStats.lowStock}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50">
                  <p className="text-muted-foreground mb-1">Out of Stock</p>
                  <p className="text-foreground">{productsStats.outOfStock}</p>
                </div>
              </div>
            </div>

            {/* Products by Category */}
            <div className="space-y-4">
              <h3 className="text-foreground">Products by Category</h3>
              {productCategories.map((category) => (
                <div 
                  key={category.name}
                  className="p-4 rounded-xl bg-gradient-to-r from-[#0F4C81]/5 to-transparent border border-[#0F4C81]/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-foreground mb-1">{category.name}</p>
                      <p className="text-muted-foreground">{category.percentage}% of inventory</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground">{category.count} products</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#0F4C81]/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0F4C81] rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Selling Products */}
            <div className="space-y-4">
              <h3 className="text-foreground">Top Selling Products</h3>
              <div className="space-y-3">
                {topProductsSales.map((product, index) => (
                  <div 
                    key={product.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                        <span className="text-[#0F4C81]">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-foreground">{product.name}</p>
                        <p className="text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground">{product.sold} sold</p>
                      <p className="text-muted-foreground">{product.stock} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={() => setIsProductsDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customers Dialog */}
      <Dialog open={isCustomersDialogOpen} onOpenChange={setIsCustomersDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-[#0F4C81] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customers
            </DialogTitle>
          </DialogHeader>
          
          {/* Coming Soon Content */}
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#0F4C81]/10 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5">
                <Users className="w-12 h-12 text-[#0F4C81]" />
              </div>
            </div>
            
            <div>
              <h3 className="text-[#0F4C81] mb-2">Customer Management Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're building an amazing customer management system. Track customer interactions, purchase history, and build lasting relationships.
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0F4C81]/10 to-[#0F4C81]/5 border border-[#0F4C81]/20">
              <CircleAlert className="w-4 h-4 text-[#0F4C81]" />
              <span className="text-[#0F4C81] font-medium">Under Development</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full shadow-lg shadow-[#0F4C81]/30"
              onClick={() => setIsCustomersDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}