import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Mic, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { usePlan } from '../../hooks/usePlan';
import { UpgradeModal } from '../UpgradeModal';
import { ordersApi } from '../../services/api';

export function AICopilot() {
  const { limits } = usePlan();
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!limits.canForecast && !limits.canAutomate) {
        setShowUpgrade(true);
        return;
    }

    setIsLoading(true);
    
    try {
      const q = query.toLowerCase();
      
      if (q.includes('total sales') || (q.includes('sales') && q.includes('how much'))) {
        const orders = await ordersApi.getAll();
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        setResponse(`Your total sales across all time is ₹${totalSales.toLocaleString('en-IN')}. You have processed ${orders.length} orders in total.`);
      } else if (q.includes('reorder')) {
        // ... (rest of the mock logic)
        // Simulate AI delay for other mock responses
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse("Based on current sales velocity, you should reorder 'Organic Coffee Beans' (12 units) and 'Olive Oil' (5 units) to avoid stockouts next week.");
      } else if (q.includes('performance') || q.includes('underperforming')) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse("'Whole Wheat Bread' sales are down 15% this week. Consider bundling it with 'Fresh Spinach' to boost movement.");
      } else if (q.includes('increase') && q.includes('sales')) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse("You have 4 items expiring soon. Running a 'Flash Sale' on these items could recover approximately ₹1,200 in revenue today.");
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponse("I've analyzed your store data. Sales are trending up 12% this week! Let me know if you need specific insights on inventory or customers.");
      }
    } catch (error) {
      console.error('Error fetching data for AI:', error);
      setResponse("I'm having trouble accessing your sales data right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-24 lg:bottom-6 z-50 pointer-events-none transition-all duration-300 flex justify-center ${isExpanded ? 'inset-x-0 px-6' : 'right-6 left-auto'}`}>
      <div className={`pointer-events-auto flex flex-col items-end ${isExpanded ? 'w-full max-w-2xl' : 'w-auto'}`}>
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-4 bg-white rounded-2xl shadow-xl border border-[#0F4C81]/10 p-5 relative overflow-hidden w-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F4C81] to-purple-500" />
              <button 
                onClick={() => setResponse(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F4C81] mb-1">Arali Insight</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{response}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                        toast.success('Action added to queue');
                        setResponse(null);
                    }}>
                      Take Action
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setResponse(null)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="fab"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 rounded-full bg-[#0F4C81] text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(15,76,129,0.4)] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.form 
              key="input"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="w-full relative bg-white/90 backdrop-blur-lg border border-[#0F4C81]/10 shadow-2xl rounded-full overflow-hidden"
              style={{ borderRadius: '2rem' }}
            >
              <div className="flex items-center p-2 pl-4">
                <Sparkles className="w-5 h-5 mr-3 text-[#0F4C81]" />
                
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Arali... (e.g., 'What should I reorder?')"
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 h-10"
                  disabled={isLoading}
                />

                <div className="flex items-center gap-1 pr-1">
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setIsExpanded(false);
                      setQuery('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {query && (
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={isLoading}
                      className="rounded-full w-9 h-9 bg-[#0F4C81] hover:bg-[#0d3f6a] transition-all"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      {/* Upgrade Modal for AI Features */}
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)}
        title="Upgrade to Access AI Copilot"
        description="AI forecasting and automation are premium features. Upgrade your plan to get instant answers and insights about your business."
      />
    </div>
  );
}
