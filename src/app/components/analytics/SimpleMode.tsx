import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';
import { analyticsInsightsApi } from '../../services/api';
import { AIInsightCard, Insight } from './AIInsightCard';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function SimpleMode() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const response = await analyticsInsightsApi.getInsights();
      setData(response);
    } catch (error) {
      console.error("Failed to load insights", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIgnore = async (id: string) => {
    setIgnoredIds(prev => new Set(prev).add(id));
    await analyticsInsightsApi.recordFeedback(id, 'ignored');
    toast.success("Insight dismissed");
  };

  const handleAction = (action: any) => {
      if (action.action_type === 'navigate') {
          navigate(action.payload.path);
      }
      // Handle other types if needed
  };

  if (loading) {
      return (
          <div className="space-y-6 animate-pulse p-1">
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
              </div>
              <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
              </div>
          </div>
      );
  }

  if (!data) return (
      <div className="text-center py-10">
          <p className="text-gray-500">Could not load insights.</p>
          <button onClick={loadInsights} className="mt-2 text-[#0F4C81] flex items-center justify-center w-full gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
          </button>
      </div>
  );

  const { storeStatus, metrics, insights } = data;
  const visibleInsights = insights.filter((i: Insight) => !ignoredIds.has(i.id));

  // Store Status Logic
  const statusColors = {
      healthy: 'bg-green-50 border-green-200 text-green-700',
      attention: 'bg-amber-50 border-amber-200 text-amber-700',
      risk: 'bg-red-50 border-red-200 text-red-700'
  };
  const StatusIcon = storeStatus.status === 'healthy' ? CheckCircle : storeStatus.status === 'attention' ? AlertTriangle : XCircle;

  return (
    <div className="space-y-8">
      {/* 1. Store Status Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`p-6 border-l-4 ${statusColors[storeStatus.status as keyof typeof statusColors]}`}>
            <div className="flex items-center gap-4">
                <StatusIcon className="w-8 h-8" />
                <div>
                    <h3 className="text-lg font-bold">Store Status: {storeStatus.status.toUpperCase()}</h3>
                    <p className="text-sm opacity-90">{storeStatus.message}</p>
                </div>
            </div>
        </Card>
      </motion.div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            label="Today's Sales" 
            value={`₹${metrics.salesToday.toLocaleString()}`} 
            icon={TrendingUp} 
            color="text-green-600"
            bg="bg-green-50"
          />
          <MetricCard 
            label="Est. Profit" 
            value={`₹${metrics.estimatedProfit.toLocaleString()}`} 
            icon={TrendingUp} 
            color={metrics.estimatedProfit >= 0 ? "text-blue-600" : "text-red-600"}
            bg={metrics.estimatedProfit >= 0 ? "bg-blue-50" : "bg-red-50"}
          />
          <MetricCard 
            label="Low Stock" 
            value={metrics.lowStockCount} 
            icon={Package} 
            color="text-orange-600"
            bg="bg-orange-50"
            highlight={metrics.lowStockCount > 0}
          />
          <MetricCard 
            label="Expiring Soon" 
            value={metrics.expiringSoonCount} 
            icon={AlertCircle} 
            color="text-red-600"
            bg="bg-red-50"
            highlight={metrics.expiringSoonCount > 0}
          />
      </div>

      {/* 3. AI Insights */}
      <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="bg-[#0F4C81] text-white text-xs px-2 py-0.5 rounded-full">AI</span>
              Arali Brain Insights
          </h3>
          
          {visibleInsights.length > 0 ? (
              visibleInsights.map((insight: Insight) => (
                  <AIInsightCard 
                    key={insight.id} 
                    insight={insight} 
                    onIgnore={handleIgnore}
                    onAction={handleAction}
                  />
              ))
          ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No critical insights for today. Good job!</p>
              </div>
          )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg, highlight }: any) {
    return (
        <Card className={`p-4 border-0 shadow-sm ${highlight ? 'ring-2 ring-offset-1 ring-red-100' : ''}`}>
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{value}</span>
                    <div className={`p-1.5 rounded-lg ${bg}`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                </div>
            </div>
        </Card>
    )
}
