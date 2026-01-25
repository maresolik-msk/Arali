import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, TrendingUp, AlertCircle, ArrowRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { PriorityCardData } from '../../data/dashboardData';

interface PriorityCardProps {
  data: PriorityCardData;
  onAction: (id: string) => void;
  onDismiss: (id: string) => void;
  index: number;
}

export function PriorityCard({ data, onAction, onDismiss, index }: PriorityCardProps) {
  const getIcon = () => {
    switch (data.type) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (data.type) {
      case 'critical': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-orange-50 border-orange-100';
      case 'opportunity': return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl border transition-all hover:shadow-lg overflow-hidden group/card",
        getBgColor()
      )}
    >
      {/* Type Indicator Line */}
      <div className={cn("h-1 w-full absolute top-0 left-0", 
         data.type === 'critical' ? "bg-red-500" :
         data.type === 'warning' ? "bg-orange-500" :
         "bg-[#0F4C81]"
      )} />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3 items-center">
                <div className={cn("p-2.5 rounded-xl bg-white shadow-sm border border-gray-100/50", 
                    data.type === 'critical' ? "text-red-600" : 
                    data.type === 'warning' ? "text-orange-600" : "text-[#0F4C81]"
                )}>
                    {getIcon()}
                </div>
                <div>
                     <h3 className="font-bold text-gray-900 text-base leading-tight">{data.title}</h3>
                     {data.confidence && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                {Math.round(data.confidence * 100)}% Confidence
                            </span>
                        </div>
                     )}
                </div>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onDismiss(data.id); }}
                className="text-gray-300 hover:text-gray-500 p-1.5 rounded-lg hover:bg-black/5 transition-colors -mr-2 -mt-2"
            >
                <X className="w-4 h-4" />
            </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-1">
            {data.description}
        </p>

        {/* Key Metrics Grid */}
        {(data.impact || data.metric) && (
            <div className="grid grid-cols-2 gap-3 mb-5">
                {data.impact && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-100 shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Impact</span>
                        <span className="text-sm font-bold text-gray-900">{data.impact}</span>
                    </div>
                )}
                {data.metric && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-100 shadow-sm">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Metric</span>
                        <span className="text-sm font-medium text-gray-700">{data.metric}</span>
                    </div>
                )}
            </div>
        )}

        {/* Primary Action Button */}
        <Button 
            onClick={() => onAction(data.id)}
            className={cn(
              "w-full h-12 justify-between group font-semibold shadow-md rounded-xl active:scale-[0.98] transition-all border border-white/10",
              data.type === 'critical' ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-red-200" :
              data.type === 'warning' ? "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-orange-200" :
              "bg-gradient-to-r from-[#0F4C81] to-[#1a5f9c] hover:from-[#0d3f6a] hover:to-[#0F4C81] text-white shadow-blue-200"
            )}
        >
            <span className="pl-1">{data.actionLabel}</span>
            <div className="flex items-center gap-2 bg-black/10 px-2 py-1 rounded-lg">
                <span className="text-[10px] uppercase tracking-wider font-bold opacity-90 hidden sm:inline-block">Execute</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </Button>
      </div>
    </motion.div>
  );
}
