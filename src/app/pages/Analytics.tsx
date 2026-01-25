import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChartLine, TrendingUp, DollarSign, ShoppingCart, Package, Star, TrendingDown, Award, AlertCircle, Brain, FileBarChart, Lock } from 'lucide-react';
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
import { productsApi, ordersApi, customersApi, vendorsApi } from '../services/api';
import type { Product, Order, Customer, Vendor } from '../data/dashboardData';
import { toast } from 'sonner';
import { usePlan } from '../hooks/usePlan';
import { UpgradeModal } from '../components/UpgradeModal';
import { useNavigate } from 'react-router';
import { SimpleMode } from '../components/analytics/SimpleMode';

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
  topVendor: Vendor | null;
  topProduct: Product | null;
  topCategory: string | null;
}

export function Analytics() {
  const navigate = useNavigate();
  const { limits, isFree, isStarter, currentPlan } = usePlan();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
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
    topVendor: null,
    topProduct: null,
    topCategory: null,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, vendorsData] = await Promise.all([
        productsApi.getAll(),
        vendorsApi.getAll(),
      ]);

      setProducts(productsData);
      setOrders([]); // Orders feature disabled
      setCustomers([]); // Customers feature disabled
      setVendors(vendorsData);

      // Calculate metrics
      calculateMetrics(productsData, [], []);
      calculateMonthlyData([]);
      calculateCategoryData(productsData, []);
      // Skip top vendor/product/category calculations since they need orders
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
      topVendor: null,
      topProduct: null,
      topCategory: null,
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
      <div className="p-6 md:p-8 space-y-8">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Deep insights into your business performance</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-lg border shadow-sm">
             <button
                onClick={() => setActiveTab('simple')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'simple' ? 'bg-[#0F4C81] text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <Brain className="w-4 h-4" />
                Arali Brain
             </button>
             <button
                onClick={() => setActiveTab('advanced')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'advanced' ? 'bg-[#0F4C81] text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <FileBarChart className="w-4 h-4" />
                Detailed Reports
             </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'simple' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <SimpleMode />
            </motion.div>
        )}

        {activeTab === 'advanced' && (
             <div className="relative min-h-[500px]">
                {!limits.canViewReports && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
                        <div className="text-center p-8 bg-white shadow-2xl rounded-2xl max-w-md border border-[#0F4C81]/20">
                            <Lock className="w-12 h-12 mx-auto text-[#0F4C81] mb-4" />
                            <h2 className="text-xl font-bold mb-2">Detailed Reports Locked</h2>
                            <p className="text-gray-600 mb-6">Upgrade to {isFree ? 'Starter' : 'Growth'} plan to view detailed analytics and charts.</p>
                            <button 
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="bg-[#0F4C81] text-white px-6 py-2 rounded-full font-medium hover:bg-[#0d3f6a]"
                            >
                                Unlock Reports
                            </button>
                        </div>
                    </div>
                 )}
                 
                 <div className={!limits.canViewReports ? "opacity-20 pointer-events-none select-none filter blur-sm transition-all duration-500" : ""}>
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Key Metrics - Product & Vendor Only */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Low Stock Items</p>
                                <h3 className="text-foreground">{metrics.lowStockCount}</h3>
                            </div>
                            </div>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
                            <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                                <Star className="w-6 h-6 text-[#0F4C81]" />
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Total Vendors</p>
                                <h3 className="text-foreground">{vendors.length}</h3>
                            </div>
                            </div>
                        </Card>
                        </div>

                        {/* Inventory Value Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
                            <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-orange-500/10">
                                <DollarSign className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Total Investment</p>
                                <h3 className="text-foreground">
                                ₹{products.reduce((sum, p) => sum + ((p.costPrice || 0) * p.stock), 0).toFixed(2)}
                                </h3>
                            </div>
                            </div>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
                            <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-green-500/10">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Total Earnings</p>
                                <h3 className="text-foreground text-green-600">
                                ₹{products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0).toFixed(2)}
                                </h3>
                            </div>
                            </div>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
                            <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-[#0F4C81]/5">
                                <ChartLine className="w-6 h-6 text-[#0F4C81]" />
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Total Profit</p>
                                <h3 className="text-foreground text-green-600">
                                ₹{products.reduce((sum, p) => {
                                    const earnings = p.price * (p.sold || 0);
                                    const cost = (p.costPrice || 0) * (p.sold || 0);
                                    return sum + (earnings - cost);
                                }, 0).toFixed(2)}
                                </h3>
                            </div>
                            </div>
                        </Card>
                        </div>

                        {/* Product Performance */}
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                        <div className="relative p-6">
                            <h3 className="text-foreground mb-6">Product Performance</h3>
                            <div className="space-y-4">
                            {products.length > 0 ? (
                                products
                                .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
                                .slice(0, 10)
                                .map((product, index) => {
                                    const totalValue = product.price * product.stock;
                                    const totalSales = product.price * (product.sold || 0);
                                    const profitMargin = product.price - (product.costPrice || 0);
                                    const profitPercentage = product.costPrice ? ((profitMargin / product.costPrice) * 100) : 0;
                                    
                                    return (
                                    <div 
                                        key={product.id} 
                                        className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10 hover:bg-[#0F4C81]/10 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                                            <span className="text-[#0F4C81]">#{index + 1}</span>
                                            </div>
                                            <div>
                                            <p className="text-foreground">{product.name}</p>
                                            <p className="text-muted-foreground">{product.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-foreground">₹{product.price.toFixed(2)}</p>
                                            <p className="text-muted-foreground">{product.stock} in stock</p>
                                        </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-[#0F4C81]/10">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Total Value</p>
                                            <p className="text-[#0F4C81]">₹{totalValue.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Total Sales</p>
                                            <p className="text-green-600">₹{totalSales.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Profit Margin</p>
                                            <p className={profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {profitPercentage.toFixed(1)}%
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                No products available
                                </div>
                            )}
                            </div>
                        </div>
                        </Card>

                        {/* Vendor Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                            <div className="relative p-6">
                            <h3 className="text-foreground mb-6">Vendor Frequency</h3>
                            <div className="space-y-4">
                                {vendors.length > 0 ? (
                                vendors
                                    .sort((a, b) => (b.totalProducts || 0) - (a.totalProducts || 0))
                                    .slice(0, 5)
                                    .map((vendor, index) => (
                                    <div 
                                        key={vendor.id} 
                                        className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                                            <span className="text-[#0F4C81]">#{index + 1}</span>
                                            </div>
                                            <div>
                                            <p className="text-foreground">{vendor.name}</p>
                                            <p className="text-muted-foreground">{vendor.email}</p>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#0F4C81]/10">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Total Products</p>
                                            <p className="text-[#0F4C81]">{vendor.totalProducts || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Total Purchases</p>
                                            <p className="text-green-600">₹{(vendor.totalPurchases || 0).toFixed(2)}</p>
                                        </div>
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No vendors available
                                </div>
                                )}
                            </div>
                            </div>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                            <div className="relative p-6">
                            <h3 className="text-foreground mb-6">Vendor Ratings</h3>
                            <div className="space-y-4">
                                {vendors.length > 0 ? (
                                vendors
                                    .filter(v => v.rating !== undefined)
                                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                                    .slice(0, 5)
                                    .map((vendor, index) => (
                                    <div 
                                        key={vendor.id} 
                                        className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10"
                                    >
                                        <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                                            <span className="text-[#0F4C81]">#{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                            <p className="text-foreground">{vendor.name}</p>
                                            <p className="text-muted-foreground">{vendor.company || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                            <span className="text-foreground">
                                            {(vendor.rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No vendor ratings available
                                </div>
                                )}
                            </div>
                            </div>
                        </Card>
                        </div>

                        {/* Revenue Management */}
                        <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                        <div className="relative p-6">
                            <h3 className="text-foreground mb-6">Revenue Management - Investment vs Earnings</h3>
                            <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-[#0F4C81]/10">
                                    <th className="text-left py-3 px-4 text-muted-foreground">Product</th>
                                    <th className="text-left py-3 px-4 text-muted-foreground">Category</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground">Cost Price</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground">Selling Price</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground">Investment</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground">Earnings</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground">Profit</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground">Margin</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => {
                                    const costPrice = product.costPrice || 0;
                                    const sellingPrice = product.price;
                                    const totalInvestment = costPrice * product.stock;
                                    const totalEarnings = sellingPrice * (product.sold || 0);
                                    const totalProfit = totalEarnings - (costPrice * (product.sold || 0));
                                    const profitMargin = costPrice > 0 ? ((sellingPrice - costPrice) / costPrice * 100) : 0;
                                    
                                    return (
                                        <tr 
                                        key={product.id} 
                                        className="border-b border-[#0F4C81]/5 hover:bg-[#0F4C81]/5 transition-colors"
                                        >
                                        <td className="py-3 px-4">
                                            <p className="text-foreground">{product.name}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-sm">
                                            {product.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-muted-foreground">
                                            ₹{costPrice.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-foreground">
                                            ₹{sellingPrice.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-orange-600">
                                            ₹{totalInvestment.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-green-600">
                                            ₹{totalEarnings.toFixed(2)}
                                        </td>
                                        <td className={`py-3 px-4 text-right ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ₹{totalProfit.toFixed(2)}
                                        </td>
                                        <td className={`py-3 px-4 text-right ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {profitMargin.toFixed(1)}%
                                        </td>
                                        </tr>
                                    );
                                    })
                                ) : (
                                    <tr>
                                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                        No products available
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                                {products.length > 0 && (
                                <tfoot className="border-t-2 border-[#0F4C81]/20 font-medium">
                                    <tr>
                                    <td colSpan={4} className="py-3 px-4 text-foreground">Total</td>
                                    <td className="py-3 px-4 text-right text-orange-600">
                                        ₹{products.reduce((sum, p) => sum + ((p.costPrice || 0) * p.stock), 0).toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-green-600">
                                        ₹{products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0).toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-green-600">
                                        ₹{products.reduce((sum, p) => {
                                        const earnings = p.price * (p.sold || 0);
                                        const cost = (p.costPrice || 0) * (p.sold || 0);
                                        return sum + (earnings - cost);
                                        }, 0).toFixed(2)}
                                    </td>
                                    <td></td>
                                    </tr>
                                </tfoot>
                                )}
                            </table>
                            </div>
                        </div>
                        </Card>
                    </motion.div>
                 </div>
            </div>
        )}

        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          title="Unlock Analytics & Reports"
          description={`Detailed analytics and reports are not available on the ${currentPlan} plan. Upgrade to gain insights into your business performance.`}
        />
      </div>
    </div>
  );
}
