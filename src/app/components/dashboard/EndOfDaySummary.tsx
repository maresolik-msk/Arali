import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Moon, TrendingUp, TrendingDown, Wallet, ShoppingBag } from 'lucide-react';
import { EndOfDaySummary as SummaryType } from '../../services/api';

interface EndOfDaySummaryProps {
  summary: SummaryType | null;
}

export function EndOfDaySummary({ summary }: EndOfDaySummaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!summary) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <motion.div 
          layout
          className="bg-[#082032] text-white rounded-t-2xl shadow-2xl overflow-hidden"
        >
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 bg-[#0F4C81] hover:bg-[#155d9b] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Moon size={18} className="text-yellow-300" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">End of Day Intelligence</div>
                <div className="text-xs text-white/60">
                  {isOpen ? 'Click to collapse' : 'Click to view daily performance'}
                </div>
              </div>
            </div>
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="text-xs text-white/50 uppercase font-bold">Total Sales</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      ₹{summary.sales.toLocaleString()}
                      <TrendingUp size={16} className="text-green-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-white/50 uppercase font-bold">Est. Profit</div>
                    <div className="text-2xl font-bold flex items-center gap-2 text-green-400">
                      ₹{summary.profit_estimate.toLocaleString()}
                      <Wallet size={16} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-white/50 uppercase font-bold">Wastage</div>
                    <div className="text-2xl font-bold flex items-center gap-2 text-red-400">
                      ₹{summary.wastage.toLocaleString()}
                      <TrendingDown size={16} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-white/50 uppercase font-bold">Best Seller</div>
                    <div className="text-lg font-bold flex items-center gap-2 truncate">
                      <ShoppingBag size={16} className="text-blue-400" />
                      {summary.best_seller}
                    </div>
                  </div>
                </div>
                
                {summary.missed_sales.length > 0 && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-orange-200">
                      <strong>Missed Opportunities:</strong> Out of stock for {summary.missed_sales.join(', ')} today.
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
