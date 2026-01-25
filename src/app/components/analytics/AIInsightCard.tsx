import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../ui/utils';

export interface Insight {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  summary: string;
  explanation: {
    what: string;
    why: string;
    fix: string;
  };
  recommended_action: {
    label: string;
    action_type: string;
    payload: any;
  };
}

interface AIInsightCardProps {
  insight: Insight;
  onIgnore: (id: string) => void;
  onAction: (action: any) => void;
}

export function AIInsightCard({ insight, onIgnore, onAction }: AIInsightCardProps) {
  const [isExplained, setIsExplained] = useState(false);

  const iconColors = {
    info: 'text-blue-500',
    warning: 'text-amber-500',
    critical: 'text-red-500',
  };

  const Icons = {
    info: Info,
    warning: AlertTriangle,
    critical: AlertTriangle, 
  };

  const Icon = Icons[insight.severity] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="relative"
    >
      <Card className={cn("p-4 border-l-4 transition-all hover:shadow-md", 
          insight.severity === 'critical' ? 'border-l-red-500' : 
          insight.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
      )}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-3 flex-1">
            <div className={cn("p-2 rounded-full h-fit flex-shrink-0", 
                insight.severity === 'critical' ? 'bg-red-100' : 
                insight.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
            )}>
                <Icon className={cn("w-5 h-5", iconColors[insight.severity])} />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base">{insight.title}</h4>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">{insight.summary}</p>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                        size="sm" 
                        onClick={() => onAction(insight.recommended_action)}
                        className={cn("text-white h-8 text-xs font-medium px-4 rounded-full",
                            insight.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' : 
                            insight.severity === 'warning' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0F4C81] hover:bg-[#0F4C81]/90'
                        )}
                    >
                        {insight.recommended_action.label}
                        <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsExplained(!isExplained)}
                        className="h-8 text-xs text-gray-500 hover:text-[#0F4C81]"
                    >
                        {isExplained ? 'Hide Details' : 'Explain Why'}
                        {isExplained ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                    </Button>
                </div>
            </div>
          </div>
          <button 
            onClick={() => onIgnore(insight.id)}
            className="text-gray-300 hover:text-gray-500 p-1 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explain Mode */}
        <AnimatePresence>
            {isExplained && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-dashed border-gray-200 overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">What Happened</span>
                            <p className="text-sm text-gray-700">{insight.explanation.what}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Why It Matters</span>
                            <p className="text-sm text-gray-700">{insight.explanation.why}</p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Recommendation</span>
                            <p className="text-sm text-gray-700 font-medium text-[#0F4C81]">{insight.explanation.fix}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
