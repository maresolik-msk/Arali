import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingBag,
  Percent,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  Target
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import type { Product, Order } from '../../data/dashboardData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';

interface RevenueAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
}

// Color palette for charts
const COLORS = ['#0F4C81', '#1E88E5', '#43A047', '#FB8C00', '#E53935', '#8E24AA'];

export function RevenueAnalysisDialog({ isOpen, onClose, products, orders }: RevenueAnalysisDialogProps) {
  
  // Calculate comprehensive revenue metrics
  const revenueAnalysis = useMemo(() => {
    // Total revenue from products
    const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
    
    // Total cost (investment)
    const totalCost = products.reduce((sum, p) => {
      const sold = p.unitsSold || 0;
      const costPrice = p.costPrice || 0;
      return sum + (sold * costPrice);
    }, 0);
    
    // Total profit (revenue - cost)
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    // Average order value
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Total units sold
    const totalUnitsSold = products.reduce((sum, p) => sum + (p.unitsSold || 0), 0);
    
    // Revenue by category
    const revenueByCategory = products.reduce((acc, p) => {
      const category = p.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          revenue: 0,
          cost: 0,
          profit: 0,
          units: 0,
          products: 0
        };
      }
      acc[category].revenue += p.revenue || 0;
      acc[category].cost += (p.unitsSold || 0) * (p.costPrice || 0);
      acc[category].profit += (p.revenue || 0) - ((p.unitsSold || 0) * (p.costPrice || 0));
      acc[category].units += p.unitsSold || 0;
      acc[category].products += 1;
      return acc;
    }, {} as Record<string, { revenue: number; cost: number; profit: number; units: number; products: number }>);
    
    // Top revenue products (top 5)
    const topProducts = [...products]
      .filter(p => (p.revenue || 0) > 0)
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        revenue: p.revenue || 0,
        profit: (p.revenue || 0) - ((p.unitsSold || 0) * (p.costPrice || 0)),
        units: p.unitsSold || 0,
        margin: p.revenue ? (((p.revenue || 0) - ((p.unitsSold || 0) * (p.costPrice || 0))) / p.revenue) * 100 : 0
      }));
    
    // Revenue breakdown for pie chart
    const categoryData = Object.entries(revenueByCategory).map(([category, data]) => ({
      name: category,
      value: data.revenue,
      profit: data.profit
    }));
    
    // Performance metrics
    const productsWithSales = products.filter(p => (p.unitsSold || 0) > 0).length;
    const productsWithoutSales = products.filter(p => (p.unitsSold || 0) === 0).length;
    const conversionRate = products.length > 0 ? (productsWithSales / products.length) * 100 : 0;
    
    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      avgOrderValue,
      totalUnitsSold,
      totalOrders,
      revenueByCategory,
      topProducts,
      categoryData,
      productsWithSales,
      productsWithoutSales,
      conversionRate
    };
  }, [products, orders]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]" aria-describedby="revenue-analysis-description">
        <DialogHeader className="p-6 pb-4 border-b border-[#0F4C81]/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a61] flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-[#0F4C81]">Revenue Analysis</DialogTitle>
              <DialogDescription id="revenue-analysis-description" className="text-muted-foreground">
                Comprehensive breakdown of your business revenue and profitability
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-[#0F4C81]" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0F4C81]">
                    {formatCurrency(revenueAnalysis.totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {revenueAnalysis.totalUnitsSold} units sold
                  </p>
                </Card>
              </motion.div>

              {/* Total Profit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 bg-white/80 backdrop-blur-xl border border-green-500/10 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Net Profit</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(revenueAnalysis.totalProfit)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      revenueAnalysis.profitMargin > 30 ? 'bg-green-100 text-green-700' :
                      revenueAnalysis.profitMargin > 15 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {revenueAnalysis.profitMargin.toFixed(1)}% margin
                    </span>
                  </div>
                </Card>
              </motion.div>

              {/* Total Cost */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-4 bg-white/80 backdrop-blur-xl border border-orange-500/10 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(revenueAnalysis.totalCost)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investment in inventory
                  </p>
                </Card>
              </motion.div>

              {/* Average Order Value */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-4 bg-white/80 backdrop-blur-xl border border-blue-500/10 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Avg Order Value</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(revenueAnalysis.avgOrderValue)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {revenueAnalysis.totalOrders} orders
                  </p>
                </Card>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Category - Bar Chart */}
              <Card className="p-6 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueAnalysis.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="value" fill="#0F4C81" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Revenue Distribution - Pie Chart */}
              <Card className="p-6 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={revenueAnalysis.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueAnalysis.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RePieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Category Performance Details */}
            <Card className="p-6 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
              <h3 className="font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Category Performance
              </h3>
              <div className="space-y-3">
                {Object.entries(revenueAnalysis.revenueByCategory)
                  .sort(([, a], [, b]) => b.revenue - a.revenue)
                  .map(([category, data], index) => {
                    const margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-gradient-to-r from-[#0F4C81]/5 to-transparent rounded-xl border border-[#0F4C81]/10 hover:border-[#0F4C81]/20 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-[#0F4C81]">{category}</span>
                            <span className="text-xs text-muted-foreground">
                              ({data.products} products)
                            </span>
                          </div>
                          <span className="font-bold text-[#0F4C81]">
                            {formatCurrency(data.revenue)}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Cost</p>
                            <p className="font-medium text-orange-600">{formatCurrency(data.cost)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Profit</p>
                            <p className="font-medium text-green-600">{formatCurrency(data.profit)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Margin</p>
                            <p className={`font-medium ${
                              margin > 30 ? 'text-green-600' :
                              margin > 15 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {margin.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Units</p>
                            <p className="font-medium text-blue-600">{data.units}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </Card>

            {/* Top Revenue Products */}
            <Card className="p-6 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
              <h3 className="font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Top Revenue Generators
              </h3>
              <div className="space-y-3">
                {revenueAnalysis.topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0F4C81]/5 to-transparent rounded-xl border border-[#0F4C81]/10 hover:border-[#0F4C81]/20 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#0a3a61] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0F4C81]">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.units} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0F4C81]">
                        {formatCurrency(product.revenue)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600 font-medium">
                          {formatCurrency(product.profit)} profit
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          product.margin > 30 ? 'bg-green-100 text-green-700' :
                          product.margin > 15 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Performance Insights */}
            <Card className="p-6 bg-white/80 backdrop-blur-xl border border-[#0F4C81]/10 shadow-lg">
              <h3 className="font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#0F4C81]/5 to-transparent rounded-xl border border-[#0F4C81]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Sales Conversion</span>
                    {revenueAnalysis.conversionRate > 50 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-[#0F4C81] mb-1">
                    {revenueAnalysis.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {revenueAnalysis.productsWithSales} of {products.length} products generating revenue
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl border border-green-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    {revenueAnalysis.profitMargin > 25 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {revenueAnalysis.profitMargin.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {revenueAnalysis.profitMargin > 30 ? 'Excellent' :
                     revenueAnalysis.profitMargin > 20 ? 'Good' :
                     revenueAnalysis.profitMargin > 10 ? 'Average' : 'Needs improvement'}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl border border-blue-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Revenue per Unit</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {revenueAnalysis.totalUnitsSold > 0 
                      ? formatCurrency(revenueAnalysis.totalRevenue / revenueAnalysis.totalUnitsSold)
                      : formatCurrency(0)
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Average revenue per unit sold
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}