import React from 'react';
import { motion } from 'motion/react';
import { TrendingDown, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/card';

interface OutcomeMetricsProps {
  revenueAtRisk: number;
  stockoutRiskCount: number;
  expiringCount: number;
  aiActionsCount: number;
}

export function OutcomeMetrics({ 
  revenueAtRisk, 
  stockoutRiskCount, 
  expiringCount, 
  aiActionsCount 
}: OutcomeMetricsProps) {
  
  const metrics = [
    {
      label: 'Revenue at Risk',
      value: `₹${revenueAtRisk.toLocaleString('en-IN')}`,
      subtext: 'Potential Loss',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100'
    },
    {
      label: 'Stockout Risk',
      value: stockoutRiskCount > 0 ? `${stockoutRiskCount} Items` : 'None',
      subtext: 'Need Reorder',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100'
    },
    {
      label: 'Expiring Soon',
      value: expiringCount > 0 ? `${expiringCount} Items` : 'None',
      subtext: 'Within 7 Days',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100'
    },
    {
      label: 'AI Actions',
      value: aiActionsCount.toString(),
      subtext: 'Automated This Week',
      icon: CheckCircle2,
      color: 'text-[#0F4C81]',
      bgColor: 'bg-[#0F4C81]/5',
      borderColor: 'border-[#0F4C81]/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + (index * 0.1) }}
        >
          <Card className={`p-4 border ${metric.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {metric.value}
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                {metric.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {metric.subtext}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
