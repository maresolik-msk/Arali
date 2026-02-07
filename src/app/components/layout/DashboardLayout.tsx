import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import svgPaths from "@/imports/svg-mkjwe92tm9";
import bottomNavSvgs from "@/imports/svg-7oxij0di9j";
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChartLine,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Store,
  Truck,
  Sparkles,
  ScanLine,
  ClipboardList,
  Zap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { Toaster } from '../ui/sonner';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../hooks/usePlan';
import { NotificationCenter } from './NotificationCenter';
import { DashboardTopBar } from './DashboardTopBar';
import { notificationsApi, productsApi, shopSettingsApi } from '../../services/api';
import { getExpiringProducts } from '../../data/dashboardData';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'POS',
    href: '/dashboard/pos',
    icon: ScanLine,
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: Package,
  },
  {
    title: 'Purchase',
    href: '/dashboard/purchase-notepad',
    icon: ClipboardList,
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    title: 'Vendors',
    href: '/dashboard/vendors',
    icon: Truck,
  },
  {
    title: 'Revenue Detailed',
    href: '/dashboard/revenue',
    icon: TrendingUp,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartLine,
  },
  {
    title: 'AI Insights',
    href: '/dashboard/ai-insights',
    icon: Sparkles,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAuthenticated, isLoading, user } = useAuth();
  const { limits, isEnterprise } = usePlan();
  const [verificationStatus, setVerificationStatus] = useState<string>('UNVERIFIED');
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      shopSettingsApi.get().then(s => setVerificationStatus(s.verificationStatus || 'UNVERIFIED')).catch(() => {});
    }
  }, [isAuthenticated]);

  const filteredNavItems = navItems.filter(item => {
    if (item.title === 'Analytics') return limits.canViewReports;
    if (item.title === 'AI Insights') return limits.canForecast;
    
    // Feature Gating: Lock money/customer features if not verified
    if (verificationStatus !== 'VERIFIED') {
        // Allow Dashboard, Inventory, Purchase, Settings
        // Block POS, Orders, Customers, Vendors, Revenue Detailed
        if (['POS', 'Orders', 'Customers', 'Vendors', 'Revenue Detailed'].includes(item.title)) {
            return false;
        }
    }
    
    return true;
  });

  // Load unread notification count - only after auth is ready
  useEffect(() => {
    // Don't make API calls until auth is loaded and user is authenticated
    if (isLoading || !isAuthenticated) {
      return;
    }

    loadUnreadCount();
    checkExpiringProducts();
    
    // Poll for updates every 5 minutes (increased from 60s to reduce server load)
    const interval = setInterval(loadUnreadCount, 300000);
    return () => clearInterval(interval);
  }, [isLoading, isAuthenticated]);

  const checkExpiringProducts = async () => {
    try {
      const today = new Date().toDateString();
      const lastCheck = localStorage.getItem('last_expiry_check');
      
      // Only check once per day
      if (lastCheck === today) return;

      const products = await productsApi.getAll();
      const expiringProducts = getExpiringProducts(products, 3); // Notify for products expiring within 3 days

      if (expiringProducts.length > 0) {
        // Create notification
        const expiringCount = expiringProducts.filter(p => p.status === 'expiring_soon').length;
        const expiredCount = expiringProducts.filter(p => p.status === 'expired').length;
        
        let message = '';
        if (expiredCount > 0) {
          message = `${expiredCount} product${expiredCount > 1 ? 's have' : ' has'} expired. `;
        }
        if (expiringCount > 0) {
          message += `${expiringCount} product${expiringCount > 1 ? 's are' : ' is'} expiring soon.`;
        }

        if (message) {
          await notificationsApi.create({
            userId: user?.id || 'unknown',
            type: 'expiry',
            title: 'Expiry Alert',
            message: message,
            read: false,
            relatedTo: {
              type: 'product',
              id: expiringProducts[0].productId,
              name: expiringProducts[0].productName
            }
          });
          
          // Force reload notifications count
          loadUnreadCount();
        }
      }
      
      localStorage.setItem('last_expiry_check', today);
    } catch (error) {
      console.error('Failed to check expiring products:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error: any) {
      // Silently fail - notifications may not be initialized yet or user not authenticated
      // Don't log to avoid console spam
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = () => {
    setNotificationCenterOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationCenterOpen(false);
    loadUnreadCount(); // Reload count when closing
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    // Navigation is now handled by the signOut function in AuthContext
  };

  const mobileNavItems = [
    { title: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Stock', href: '/dashboard/inventory', icon: Package },
    { title: 'POS', href: '/dashboard/pos', icon: ScanLine, special: true },
    { title: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  ];

  const getNotepadTab = () => {
    if (location.pathname.includes('purchase-notepad')) return 'Purchase';
    if (location.pathname.includes('notepad') || location.pathname.includes('express')) {
       const params = new URLSearchParams(location.search);
       if (params.get('mode') === 'owner') return 'Owner';
       return 'Sale';
    }
    return undefined;
  };

  const handleNotepadTabChange = (tab: 'Sale' | 'Purchase' | 'Owner') => {
    if (tab === 'Purchase') {
      navigate('/dashboard/purchase-notepad');
    } else if (tab === 'Owner') {
      navigate('/dashboard/notepad?mode=owner');
    } else {
      navigate('/dashboard/express');
    }
  };

  const getPageTitle = () => {
    if (location.pathname.includes('express')) return 'Express Mode';
    if (location.pathname.includes('notepad')) return 'Smart Notepad';
    
    // Find the matching nav item
    // Sort by length desc to match most specific path first (e.g. /dashboard/orders vs /dashboard)
    const sortedItems = [...navItems].sort((a, b) => b.href.length - a.href.length);
    const match = sortedItems.find(item => {
      if (item.href === '/dashboard') return location.pathname === '/dashboard';
      return location.pathname.startsWith(item.href);
    });
    
    return match ? match.title : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl border-r border-[#0F4C81]/10 shadow-xl">
          {/* Logo */}
          <div className="flex items-center justify-center h-24 px-6 border-b border-[#0F4C81]/10">
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                    active
                      ? 'bg-[#0F4C81] text-white shadow-lg shadow-[#0F4C81]/20'
                      : 'text-[#082032]/60 hover:bg-[#0F4C81]/5 hover:text-[#0F4C81]'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-[#0F4C81] rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn('w-5 h-5 relative z-10', active ? 'text-white' : '')} />
                  <span className="relative z-10">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Verification / Upgrade CTA */}
          {verificationStatus !== 'VERIFIED' ? (
             <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg">
                 <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                 
                 <h3 className="font-bold text-sm mb-1">Verify Business</h3>
                 <p className="text-xs text-white/90 mb-3">Unlock POS & Payments</p>
                 <Link to="/dashboard/settings">
                   <Button size="sm" variant="secondary" className="w-full bg-white text-amber-600 hover:bg-white/90 text-xs h-8 border-none">
                     <ShieldCheck className="w-3 h-3 mr-1" />
                     Verify Now
                   </Button>
                 </Link>
              </div>
            </div>
          ) : !isEnterprise && (
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-[#0F4C81] to-[#1E6091] rounded-2xl p-4 text-white relative overflow-hidden shadow-lg">
                 <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                 
                 <h3 className="font-bold text-sm mb-1">Upgrade Plan</h3>
                 <p className="text-xs text-white/80 mb-3">Get more features & limits.</p>
                 <Link to="/select-plan?mode=upgrade">
                   <Button size="sm" variant="secondary" className="w-full bg-white text-[#0F4C81] hover:bg-white/90 text-xs h-8 border-none">
                     <Zap className="w-3 h-3 mr-1 fill-current" />
                     Upgrade Now
                   </Button>
                 </Link>
              </div>
            </div>
          )}

          {/* User Profile Section */}
          <div className="p-4 border-t border-[#0F4C81]/10">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#0F4C81]/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/70 flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-foreground">My Store</p>
                <p className="text-muted-foreground">Store Owner</p>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-[#0F4C81] transition-transform duration-300',
                userMenuOpen && 'rotate-180'
              )} />
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-[#0F4C81]/10 shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between h-24 px-6 border-b border-[#0F4C81]/10">
                  <Logo />
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-[#0F4C81]/5 transition-colors"
                  >
                    <X className="w-6 h-6 text-[#0F4C81]" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                          active
                            ? 'bg-[#0F4C81] text-white shadow-lg shadow-[#0F4C81]/20'
                            : 'text-[#082032]/60 hover:bg-[#0F4C81]/5 hover:text-[#0F4C81]'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Verification / Upgrade CTA */}
                {verificationStatus !== 'VERIFIED' ? (
                   <div className="px-4 pb-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg">
                       <h3 className="font-bold text-sm mb-1">Verify Business</h3>
                       <p className="text-xs text-white/90 mb-3">Unlock POS & Payments</p>
                       <Link to="/dashboard/settings" onClick={() => setSidebarOpen(false)}>
                         <Button size="sm" variant="secondary" className="w-full bg-white text-amber-600 hover:bg-white/90 text-xs h-8 border-none">
                           <ShieldCheck className="w-3 h-3 mr-1" />
                           Verify Now
                         </Button>
                       </Link>
                    </div>
                  </div>
                ) : !isEnterprise && (
                  <div className="px-4 pb-4">
                    <div className="bg-gradient-to-br from-[#0F4C81] to-[#1E6091] rounded-2xl p-4 text-white relative overflow-hidden shadow-lg">
                       <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                       
                       <h3 className="font-bold text-sm mb-1">Upgrade Plan</h3>
                       <p className="text-xs text-white/80 mb-3">Get more features & limits.</p>
                       <Link to="/select-plan?mode=upgrade" onClick={() => setSidebarOpen(false)}>
                         <Button size="sm" variant="secondary" className="w-full bg-white text-[#0F4C81] hover:bg-white/90 text-xs h-8 border-none">
                           <Zap className="w-3 h-3 mr-1 fill-current" />
                           Upgrade Now
                         </Button>
                       </Link>
                    </div>
                  </div>
                )}

                {/* User Profile Section */}
                <div className="p-4 border-t border-[#0F4C81]/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <DashboardTopBar 
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={handleNotificationClick}
          unreadCount={unreadCount}
          className="sticky top-0 lg:hidden"
          variant={(location.pathname.includes('notepad') || location.pathname.includes('express')) ? 'notepad' : 'default'}
          activeTab={getNotepadTab()}
          onTabChange={handleNotepadTabChange}
          title={getPageTitle()}
        />
        <header className="hidden lg:flex sticky top-0 z-30 h-24 bg-white/80 backdrop-blur-xl border-b border-[#0F4C81]/10 shadow-sm">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-[#0F4C81]/5 transition-colors"
            >
              <Menu className="w-6 h-6 text-[#0F4C81]" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F4C81]/40" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full h-12 pl-12 pr-4 rounded-full bg-[#0F4C81]/5 border border-[#0F4C81]/10 focus:border-[#0F4C81]/30 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                className="p-3 rounded-full hover:bg-[#0F4C81]/5 transition-colors relative"
                onClick={handleNotificationClick}
              >
                <Bell className="w-5 h-5 text-[#0F4C81]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-[#0F4C81]/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/70 flex items-center justify-center text-white">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-foreground">My Store</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-6rem)] pb-24 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white flex items-center justify-between px-6 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] border-t border-[#F0F2F4] lg:hidden">
        
        {/* Home */}
        <Link
          to="/dashboard"
          className="flex flex-col items-center justify-center gap-1 min-w-[3rem] group"
        >
          <div className="relative w-[26px] h-[26px]">
            <svg className="w-full h-full" viewBox="0 0 22 22" fill="none">
              <path d={bottomNavSvgs.p21674600} fill={isActive('/dashboard') ? "#0F4C81" : "#546F86"} fillOpacity={isActive('/dashboard') ? "0.16" : "0"} />
              <path d={bottomNavSvgs.p26828100} fill={isActive('/dashboard') ? "#0F4C81" : "#546F86"} />
            </svg>
          </div>
          {isActive('/dashboard') && (
            <span className="text-[10px] font-['Mplus_1p:Medium',sans-serif] leading-[15px] tracking-[0.12px] text-[#0F4C81]">Home</span>
          )}
        </Link>

        {/* Inventory (Box) */}
        <Link
          to="/dashboard/inventory"
          className="flex flex-col items-center justify-center gap-1 min-w-[3rem] group"
        >
          <div className="relative w-[26px] h-[26px]">
            <svg className="w-full h-full" viewBox="0 0 26 26" fill="none">
              <path d={bottomNavSvgs.p11dc5840} stroke={isActive('/dashboard/inventory') ? "#0F4C81" : "#546F86"} strokeLinejoin="round" />
            </svg>
          </div>
          {isActive('/dashboard/inventory') && (
            <span className="text-[10px] font-medium text-[#0F4C81]">Stock</span>
          )}
        </Link>

        {/* Add Button (Plus) */}
        <div className="relative -top-8 group">
          <AnimatePresence>
            {addMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAddMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white rounded-xl shadow-xl border border-[#0F4C81]/10 p-2 min-w-[160px] flex flex-col gap-1 z-50"
                >
                  <Link
                    to="/dashboard/notepad"
                    onClick={() => setAddMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F9FC] rounded-lg text-[#082032] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                      <ClipboardList size={16} />
                    </div>
                    <span className="font-medium text-sm">Note</span>
                  </Link>
                  <Link
                    to="/dashboard/inventory?action=add"
                    onClick={() => setAddMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F9FC] rounded-lg text-[#082032] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                      <Package size={16} />
                    </div>
                    <span className="font-medium text-sm">Product</span>
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="w-[56px] h-[56px] bg-[#0F4C81] rounded-full flex items-center justify-center shadow-[0px_8px_10px_-6px_rgba(15,76,129,0.3)] border-[4px] border-white transition-transform active:scale-95"
          >
             <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={cn("transition-transform duration-300", addMenuOpen && "rotate-45")}>
               <path d={bottomNavSvgs.pe998d00} fill="white" />
             </svg>
          </button>
        </div>

        {/* Notepad (Edit Pen) */}
        <Link
          to="/dashboard/express"
          className="flex flex-col items-center justify-center gap-1 min-w-[3rem] group cursor-pointer"
        >
          <div className={cn("relative w-[24px] h-[24px] flex items-center justify-center", isActive('/dashboard/express') ? "text-[#0F4C81]" : "text-[#546F86]")}>
             <Zap className="w-6 h-6" strokeWidth={isActive('/dashboard/express') ? 2 : 1.5} fill={isActive('/dashboard/express') ? "currentColor" : "none"} />
          </div>
          {isActive('/dashboard/express') && (
            <span className="text-[10px] font-medium text-[#0F4C81]">Express</span>
          )}
        </Link>

        {/* AI Insights (Sparkles) */}
        <Link
          to="/dashboard/insights"
          className="flex flex-col items-center justify-center gap-1 min-w-[3rem] group"
        >
          <div className={cn("relative w-[26px] h-[26px] rounded-full flex items-center justify-center", !isActive('/dashboard/insights') && "shadow-[0px_0px_44px_0px_rgba(0,0,0,0.16)]")}>
            <svg className="w-full h-full" viewBox="0 0 26 26" fill="none">
              <path d={bottomNavSvgs.p34fb2b40} fill={isActive('/dashboard/insights') ? "#0F4C81" : "#546F86"} />
            </svg>
          </div>
          {isActive('/dashboard/insights') && (
            <span className="text-[10px] font-medium text-[#0F4C81]">AI</span>
          )}
        </Link>
      </div>

      <Toaster />
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={handleNotificationClose}
      />
    </div>
  );
}