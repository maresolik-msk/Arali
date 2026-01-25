import React from 'react';
import { motion } from 'motion/react';
import { Activity, HeartPulse } from 'lucide-react';
import { cn } from '../ui/utils';

interface StoreHealthWidgetProps {
  score: number;
  status: 'HEALTHY' | 'NEEDS_ATTENTION' | 'RISK';
}

export function StoreHealthWidget({ score, status }: StoreHealthWidgetProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'HEALTHY': return 'text-green-600 bg-green-50 border-green-100';
      case 'NEEDS_ATTENTION': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'RISK': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'HEALTHY': return 'Healthy Store';
      case 'NEEDS_ATTENTION': return 'Needs Attention';
      case 'RISK': return 'Action Required';
      default: return 'Unknown';
    }
  };

  return (
    <div className={cn("rounded-2xl border p-4 flex items-center justify-between", getStatusColor())}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-full shadow-sm">
          <HeartPulse size={20} className="currentColor" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase opacity-80">Store Health</div>
          <div className="font-bold text-lg leading-tight">{getStatusLabel()}</div>
        </div>
      </div>
      
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="opacity-20"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (125.6 * score) / 100}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-bold">{score}</span>
      </div>
    </div>
  );
}
