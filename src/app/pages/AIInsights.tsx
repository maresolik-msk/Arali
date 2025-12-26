import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Package, Lightbulb, Target, BarChart3, AlertCircle, Loader, Zap, Award, ArrowUp, ArrowDown, Activity, Clock } from 'lucide-react';
import { analyzePurchasePatterns, AIAnalysis, AnalyticsData } from '../services/ai';
import { toast } from 'sonner';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AIInsights() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzePurchasePatterns();
      setAnalysis(result.analysis);
      setAnalyticsData(result.analyticsData);
      setHasAnalyzed(true);
      toast.success('AI analysis completed successfully!');
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze patterns';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a61] flex items-center justify-center shadow-lg shadow-[#0F4C81]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[#0F4C81]">AI Insights</h1>
              <p className="text-xs text-muted-foreground">Powered by MSK</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analyze Button - Hero Style */}
      {!hasAnalyzed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81] to-[#0a3a61] rounded-3xl p-8 shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-white mb-3">Unlock AI Insights</h2>
              <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto">
                Discover patterns, optimize inventory, and boost profits
              </p>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-8 py-4 bg-white text-[#0F4C81] rounded-full hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto font-medium"
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-[#0F4C81]/20 border-t-[#0F4C81]"
            ></motion.div>
            <div className="absolute inset-4 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#0F4C81]" />
            </div>
          </div>
          <p className="text-[#0F4C81] font-medium">AI is analyzing...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {hasAnalyzed && analyticsData && analysis && !loading && (
        <>
          {/* Quick Stats - Visual Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {/* Total Products */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-[#0F4C81]/10 backdrop-blur-xl border border-[#0F4C81]/20 rounded-2xl p-4"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#0F4C81]/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a61] flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0F4C81]">{analyticsData.totalProducts}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Revenue */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{formatNumber(analyticsData.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Sales */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{formatNumber(analyticsData.totalSales)}</p>
                    <p className="text-xs text-muted-foreground">Units Sold</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Low Stock Alert */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-4"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{analyticsData.lowStockCount}</p>
                    <p className="text-xs text-muted-foreground">Low Stock</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Key Insights - Compact Visual */}
          {analysis.insights && analysis.insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/20 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[#0F4C81] font-semibold">Key Insights</h3>
                </div>
                <div className="space-y-2">
                  {analysis.insights.slice(0, 3).map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-gradient-to-r from-[#0F4C81]/5 to-transparent rounded-xl border-l-4 border-[#0F4C81]"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-[#082032] flex-1 leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Recommendations - Icon Grid */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-green-700 font-semibold">Action Items</h3>
                </div>
                <div className="space-y-3">
                  {analysis.recommendations.slice(0, 3).map((recommendation, index) => {
                    // Try to match with top products if mentioned
                    const relatedProduct = analyticsData.topProducts.find(p => 
                      recommendation.toLowerCase().includes(p.name.toLowerCase())
                    );
                    
                    return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl border-l-4 border-green-500"
                    >
                      {relatedProduct && relatedProduct.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-green-100 shadow-sm bg-white">
                          <ImageWithFallback 
                            src={relatedProduct.imageUrl} 
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                          <ArrowUp className="w-4 h-4" />
                        </div>
                      )}
                      <p className="text-sm text-[#082032] flex-1 leading-relaxed font-medium">{recommendation}</p>
                    </motion.div>
                  )})}
                </div>
              </div>
            </motion.div>
          )}

          {/* Predicted Trends - Visual Timeline */}
          {analysis.predictions && analysis.predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-blue-700 font-semibold">Trends</h3>
                </div>
                <div className="space-y-2">
                  {analysis.predictions.slice(0, 3).map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border-l-4 border-blue-500"
                    >
                      <div className="text-xl flex-shrink-0">📈</div>
                      <p className="text-sm text-[#082032] flex-1 leading-relaxed">{prediction}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Inventory Optimization - Compact Cards */}
          {analysis.inventoryOptimization && analysis.inventoryOptimization.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-4"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-purple-700 font-semibold">Optimize Stock</h3>
                </div>
                <div className="space-y-2">
                  {analysis.inventoryOptimization.slice(0, 3).map((optimization, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-xl border-l-4 border-purple-500"
                    >
                      <div className="text-xl flex-shrink-0">📦</div>
                      <p className="text-sm text-[#082032] flex-1 leading-relaxed">{optimization}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Expiry Actions - High Priority */}
          {analysis.expiryActions && analysis.expiryActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-4"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-orange-700 font-semibold">Expiring Stock Actions</h3>
                </div>
                <div className="space-y-3">
                  {analysis.expiryActions.slice(0, 3).map((action, index) => {
                    // Find product related to this action
                    // We look for product names in the action text
                    const relatedProduct = analyticsData.expiringProducts?.find(p => 
                      action.toLowerCase().includes(p.name.toLowerCase())
                    );
                    
                    return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border-l-4 border-orange-500 hover:shadow-md transition-all"
                    >
                      {relatedProduct && relatedProduct.imageUrl ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-orange-100 shadow-sm bg-white">
                          <ImageWithFallback 
                            src={relatedProduct.imageUrl} 
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xl flex-shrink-0">
                          🏷️
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <p className="text-sm text-[#082032] leading-relaxed font-medium">{action}</p>
                        {relatedProduct && (
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full font-medium">
                               Expires: {new Date(relatedProduct.expiryDate).toLocaleDateString()}
                             </span>
                             <span className="text-xs text-gray-500">
                               Stock: {relatedProduct.stock} units
                             </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )})}
                </div>
              </div>
            </motion.div>
          )}

          {/* Refresh Analysis Button - Floating Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-6"
          >
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#0F4C81] to-[#0a3a61] text-white rounded-full hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Refresh Analysis
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}