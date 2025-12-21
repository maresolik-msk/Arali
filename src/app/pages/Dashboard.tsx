import React from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  CircleAlert,
  ChartLine
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
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

// Mock data for the dashboard
const metrics = [
  {
    title: 'Total Revenue',
    value: '$45,231',
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

const salesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 5000, orders: 32 },
  { name: 'Thu', sales: 2780, orders: 19 },
  { name: 'Fri', sales: 6890, orders: 42 },
  { name: 'Sat', sales: 7390, orders: 51 },
  { name: 'Sun', sales: 5490, orders: 35 },
];

const lowStockItems = [
  { id: 1, name: 'Organic Coffee Beans', stock: 12, threshold: 50 },
  { id: 2, name: 'Almond Milk', stock: 8, threshold: 30 },
  { id: 3, name: 'Whole Wheat Bread', stock: 5, threshold: 25 },
  { id: 4, name: 'Fresh Spinach', stock: 15, threshold: 40 },
];

const recentOrders = [
  { id: '#ORD-1234', customer: 'John Smith', amount: '$156.00', status: 'Completed', time: '2 min ago' },
  { id: '#ORD-1233', customer: 'Sarah Johnson', amount: '$89.50', status: 'Processing', time: '15 min ago' },
  { id: '#ORD-1232', customer: 'Mike Davis', amount: '$234.00', status: 'Completed', time: '1 hour ago' },
  { id: '#ORD-1231', customer: 'Emily Brown', amount: '$67.25', status: 'Pending', time: '2 hours ago' },
];

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
  const handleRestock = (itemName: string) => {
    const quantity = prompt(`How many units of ${itemName} would you like to order?`);
    if (quantity && !isNaN(Number(quantity))) {
      alert(`Order placed for ${quantity} units of ${itemName}. Your supplier will be notified.`);
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
          <h1 className="text-foreground">Dashboard Overview</h1>
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
            return (
              <motion.div
                key={metric.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0F4C81" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
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
                  {lowStockItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#0F4C81]/5 to-transparent border border-[#0F4C81]/10 hover:border-[#0F4C81]/20 transition-all"
                    >
                      <div className="flex-1">
                        <p className="text-foreground mb-1">{item.name}</p>
                        <p className="text-muted-foreground">
                          {item.stock} units left (threshold: {item.threshold})
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white rounded-full"
                        onClick={() => handleRestock(item.name)}
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
    </div>
  );
}