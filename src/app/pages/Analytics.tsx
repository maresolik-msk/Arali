import React from 'react';
import { motion } from 'motion/react';
import { ChartLine, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
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

const monthlyData = [
  { month: 'Jan', revenue: 4200, orders: 145 },
  { month: 'Feb', revenue: 3800, orders: 132 },
  { month: 'Mar', revenue: 5100, orders: 178 },
  { month: 'Apr', revenue: 4600, orders: 156 },
  { month: 'May', revenue: 6200, orders: 210 },
  { month: 'Jun', revenue: 5800, orders: 198 },
  { month: 'Jul', revenue: 7100, orders: 245 },
  { month: 'Aug', revenue: 6800, orders: 230 },
  { month: 'Sep', revenue: 7500, orders: 260 },
  { month: 'Oct', revenue: 8200, orders: 285 },
  { month: 'Nov', revenue: 7800, orders: 270 },
  { month: 'Dec', revenue: 9100, orders: 315 },
];

const categoryData = [
  { name: 'Beverages', value: 35, color: '#0F4C81' },
  { name: 'Dairy', value: 25, color: '#2563EB' },
  { name: 'Bakery', value: 20, color: '#3B82F6' },
  { name: 'Vegetables', value: 12, color: '#60A5FA' },
  { name: 'Others', value: 8, color: '#93C5FD' },
];

export function Analytics() {
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
                <h3 className="text-foreground">$156.50</h3>
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
                <h3 className="text-foreground">+24.5%</h3>
              </div>
            </div>
          </Card>
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Conversion Rate</p>
                <h3 className="text-foreground">3.2%</h3>
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
                <h3 className="text-foreground">$1,240</h3>
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
              <h3 className="text-foreground mb-6">Revenue Trend</h3>
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
            </div>
          </Card>

          {/* Sales by Category */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <h3 className="text-foreground mb-6">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Orders */}
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg overflow-hidden lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <h3 className="text-foreground mb-6">Monthly Orders</h3>
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
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
