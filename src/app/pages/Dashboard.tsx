import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronRight, 
  Clock, 
  ArrowUpRight,
  Store,
  ScanLine,
  Search,
  ClipboardList,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { 
  productsApi, 
  ordersApi,
  dashboardApi,
  DailyMission,
  StoreHealth,
  EndOfDaySummary as SummaryType
} from '../services/api';
import type { Product, Order } from '../data/dashboardData';
import { useAuth } from '../contexts/AuthContext';
import { 
  getLowStockProducts, 
  getExpiringProducts, 
  calculateRevenueAtRisk,
  generatePriorityCards,
  PriorityCardData
} from '../data/dashboardData';
import { Button } from '../components/ui/button';
import { PriorityActionStack } from '../components/dashboard/PriorityActionStack';
import { DailyMissionCard } from '../components/dashboard/DailyMissionCard';
import { StoreHealthWidget } from '../components/dashboard/StoreHealthWidget';
import { EndOfDaySummary } from '../components/dashboard/EndOfDaySummary';
import { AICopilot } from '../components/dashboard/AICopilot';
import { cn } from '../components/ui/utils';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Computed State
  const [priorityCards, setPriorityCards] = useState<PriorityCardData[]>([]);
  const [revenueAtRisk, setRevenueAtRisk] = useState(0);
  const [stockoutRiskCount, setStockoutRiskCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);

  // New Dashboard Features State
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [storeHealth, setStoreHealth] = useState<StoreHealth | null>(null);
  const [eodSummary, setEodSummary] = useState<SummaryType | null>(null);

  // Load data
  useEffect(() => {
    let isMounted = true;
    
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        // Fetch core data needed for decisions
        const [productsData, ordersData, missionsData, healthData, summaryData] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll(),
          dashboardApi.getDailyMissions(),
          dashboardApi.getStoreHealth(),
          dashboardApi.getEndOfDaySummary()
        ]);

        if (isMounted) {
          setProducts(productsData);
          setOrders(ordersData);
          setMissions(missionsData);
          setStoreHealth(healthData);
          setEodSummary(summaryData);

          // Calculate AI-driven metrics (Legacy Priority Cards)
          const cards = generatePriorityCards(productsData);
          setPriorityCards(cards);
          
          const riskValue = calculateRevenueAtRisk(productsData);
          setRevenueAtRisk(riskValue);
          
          const lowStock = getLowStockProducts(productsData);
          setStockoutRiskCount(lowStock.length);
          
          const expiring = getExpiringProducts(productsData, 7);
          setExpiringCount(expiring.length);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        if (isMounted) {
          toast.error('Failed to sync with Arali Brain.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadDashboardData();
    
    return () => { isMounted = false; };
  }, []);

  const handlePriorityAction = (id: string) => {
    if (id.startsWith('stock')) {
      navigate('/dashboard/inventory');
    } else if (id.startsWith('expiry')) {
      navigate('/dashboard/inventory');
    } else if (id.startsWith('opp')) {
      navigate('/dashboard/orders');
    }
    
    setPriorityCards(prev => prev.filter(card => card.id !== id));
    toast.success('Action initiated successfully');
  };

  const handleDismiss = (id: string) => {
    setPriorityCards(prev => prev.filter(card => card.id !== id));
    toast('Recommendation dismissed');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamic Quick Actions Logic
  const getDynamicQuickActions = () => {
    const hour = new Date().getHours();
    const actions = [];

    // Always include POS (Core Action)
    actions.push({
      title: "New Sale",
      desc: "Open POS",
      icon: <ScanLine size={28} className="mb-4" />,
      bgIcon: <ScanLine size={64} />,
      onClick: () => navigate('/dashboard/pos'),
      variant: 'primary'
    });

    // Express Mode (High Priority)
    actions.push({
      title: "Express Mode",
      desc: "Fast checkout",
      icon: <Zap size={28} className="mb-4 text-amber-700" />,
      bgIcon: <Zap size={64} className="text-amber-500/20" />,
      onClick: () => navigate('/dashboard/pos', { state: { mode: 'express' } }),
      variant: 'express'
    });

    // Time-based & Context-based Actions
    if (hour < 11) {
      // Morning: Check stock & prepare
      if (stockoutRiskCount > 0) {
        actions.push({
          title: "Restock",
          desc: `${stockoutRiskCount} Low Items`,
          icon: <Plus size={24} />,
          onClick: () => navigate('/dashboard/inventory?filter=low_stock'),
          variant: 'secondary'
        });
      } else {
        actions.push({
          title: "Add Stock",
          desc: "Update inventory",
          icon: <Plus size={24} />,
          onClick: () => navigate('/dashboard/inventory?action=add'),
          variant: 'secondary'
        });
      }
    } else if (hour > 18) {
      // Evening: Review orders & customers
      actions.push({
        title: "Daily Summary",
        desc: "View Report",
        icon: <ClipboardList size={24} />,
        onClick: () => navigate('/dashboard/analytics'),
        variant: 'secondary'
      });
    } else {
      // Mid-day: Operations
      actions.push({
        title: "Orders",
        desc: "View history",
        icon: <ShoppingCart size={24} />,
        onClick: () => navigate('/dashboard/orders'),
        variant: 'secondary'
      });
    }

    // Smart Notepad (Always useful)
    actions.push({
      title: "Smart Notepad",
      desc: "Quick entry",
      icon: <ClipboardList size={24} />,
      onClick: () => navigate('/dashboard/notepad'),
      variant: 'secondary'
    });

    // Customer Management (Fill 4th slot if needed)
    if (actions.length < 4) {
      actions.push({
        title: "Customers",
        desc: "Manage profiles",
        icon: <Users size={24} />,
        onClick: () => navigate('/dashboard/customers'),
        variant: 'secondary'
      });
    }

    return actions.slice(0, 4);
  };

  const quickActions = getDynamicQuickActions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0F4C81] font-medium animate-pulse">Syncing store data...</p>
        </div>
      </div>
    );
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC] pb-32">
      <AICopilot />

      <motion.div 
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemAnimation} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C81] tracking-tight mb-1">
              {getGreeting()}, {user?.user_metadata?.name?.split(' ')[0] || 'Store Owner'}
            </h1>
            <p className="text-[#082032]/60 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {storeHealth && (
            <div className="w-full sm:w-auto">
              <StoreHealthWidget score={storeHealth.score} status={storeHealth.status} />
            </div>
          )}
        </motion.div>

        {/* Daily Mission - Top Priority */}
        <motion.section variants={itemAnimation}>
          <DailyMissionCard missions={missions} />
        </motion.section>

        {/* Priority Actions - Hero Section */}
        {priorityCards.length > 0 && (
          <motion.section variants={itemAnimation} className="relative z-10">
            <PriorityActionStack 
              cards={priorityCards} 
              onAction={handlePriorityAction}
              onDismiss={handleDismiss}
            />
          </motion.section>
        )}

        {/* Key Metrics Grid */}
        <motion.section variants={itemAnimation}>
          <h2 className="text-lg font-bold text-[#0F4C81] mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Store Pulse
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/dashboard/express?mode=owner')}
              className="bg-white p-5 rounded-2xl border border-[#0F4C81]/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                  <ShoppingCart size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Sales</span>
              </div>
              <div className="text-2xl font-bold text-[#082032]">₹{(orders.reduce((acc, curr) => acc + curr.totalAmount, 0)).toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight size={12} />
                <span>+12% vs last week</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#0F4C81]/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Package size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Products</span>
              </div>
              <div className="text-2xl font-bold text-[#082032]">{products.length}</div>
               <div className="text-xs text-blue-600 flex items-center gap-1 mt-1 font-medium">
                <span>Active Inventory</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#0F4C81]/5 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <AlertTriangle size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Low Stock</span>
              </div>
              <div className="text-2xl font-bold text-[#082032]">{stockoutRiskCount}</div>
               <div className="text-xs text-orange-600 flex items-center gap-1 mt-1 font-medium">
                <span>Items need reorder</span>
              </div>
            </div>

             <div className="bg-white p-5 rounded-2xl border border-[#0F4C81]/5 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <Clock size={18} />
                </div>
                <span className="text-sm font-medium text-gray-500">Expiring</span>
              </div>
              <div className="text-2xl font-bold text-[#082032]">{expiringCount}</div>
               <div className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                <span>Risk: ₹{revenueAtRisk.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={itemAnimation}>
          <h2 className="text-lg font-bold text-[#0F4C81] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={action.onClick}
                className={cn(
                  "group p-6 rounded-2xl text-left relative overflow-hidden transition-all",
                  action.variant === 'primary' 
                    ? "bg-gradient-to-br from-[#0F4C81] to-[#1E6091] text-white shadow-lg shadow-[#0F4C81]/20 hover:scale-[1.02]" 
                    : action.variant === 'express'
                    ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 border border-amber-200/50 hover:scale-[1.02]"
                    : "bg-white border border-[#0F4C81]/10 text-[#0F4C81] hover:border-[#0F4C81]/30 hover:shadow-md"
                )}
              >
                {action.bgIcon && (
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    {action.bgIcon}
                  </div>
                )}
                
                {action.variant === 'primary' || action.variant === 'express' ? (
                  action.icon
                ) : (
                  <div className="bg-[#0F4C81]/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0F4C81]/10 transition-colors">
                    {action.icon}
                  </div>
                )}
                
                <div className={cn(
                  "font-bold text-lg",
                  action.variant === 'secondary' && "text-[#082032]"
                )}>
                  {action.title}
                </div>
                <div className={cn(
                  "text-sm",
                  action.variant === 'primary' ? "text-white/70" : action.variant === 'express' ? "text-amber-800/70" : "text-[#082032]/60"
                )}>
                  {action.desc}
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section variants={itemAnimation} className="pb-8">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-[#0F4C81]">Recent Activity</h2>
             <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/orders')} className="text-[#0F4C81] hover:bg-[#0F4C81]/5">
               View All <ChevronRight size={16} className="ml-1" />
             </Button>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#0F4C81]/10 shadow-sm overflow-hidden">
            {orders.length === 0 ? (
               <div className="p-8 text-center text-[#082032]/40">
                 <Store size={48} className="mx-auto mb-3 opacity-20" />
                 <p>No recent activity found.</p>
               </div>
            ) : (
              <div className="divide-y divide-[#0F4C81]/5">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#F5F9FC] transition-colors cursor-pointer" onClick={() => navigate('/dashboard/orders')}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0F4C81]/5 flex items-center justify-center text-[#0F4C81]">
                        <ShoppingCart size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#082032]">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-xs text-[#082032]/50">
                          {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.items.length} items
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0F4C81]">₹{order.totalAmount.toLocaleString()}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 inline-block mt-1">
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* End of Day Summary */}
        <EndOfDaySummary summary={eodSummary} />
      </motion.div>
    </div>
  );
}