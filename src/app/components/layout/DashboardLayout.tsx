import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import svgPaths from "@/imports/svg-mkjwe92tm9";
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
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { Toaster } from '../ui/sonner';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../hooks/usePlan';
import { NotificationCenter } from './NotificationCenter';
import { notificationsApi, productsApi } from '../../services/api';
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

  const filteredNavItems = navItems.filter(item => {
    if (item.title === 'Analytics') return limits.canViewReports;
    if (item.title === 'AI Insights') return limits.canForecast;
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
    
    // Poll for updates every 60 seconds (increased from 30)
    const interval = setInterval(loadUnreadCount, 60000);
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

          {/* Upgrade CTA */}
          {!isEnterprise && (
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

                {/* Upgrade CTA */}
                {!isEnterprise && (
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
        <header className="sticky top-0 z-30 h-24 bg-white/80 backdrop-blur-xl border-b border-[#0F4C81]/10 shadow-sm">
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
      <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 px-2 sm:px-6 flex justify-between items-end pointer-events-none lg:hidden">
        
        {/* Left: Add Button */}
        <Link
          to="/dashboard/inventory?action=add"
          className="pointer-events-auto group relative"
        >
          <div className="bg-[#0F4C81] w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center shadow-[0px_8px_10px_-6px_rgba(15,76,129,0.3)] border-[4px] border-[#F5F9FC] transition-transform active:scale-95">
             <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="scale-90 sm:scale-100">
               <path d={svgPaths.pe998d00} fill="white" />
             </svg>
          </div>
        </Link>
    
        {/* Center: Navigation Pill */}
        <div className="pointer-events-auto bg-white h-[48px] sm:h-[56px] px-2 rounded-[46px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] flex items-center gap-1">
           {/* Home */}
           <Link to="/dashboard" className={cn("w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center rounded-full transition-colors", isActive('/dashboard') ? "bg-[#F0F2F4]" : "hover:bg-gray-50")}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="scale-90 sm:scale-100">
               <path d={svgPaths.p5b53800} fill={isActive('/dashboard') ? "black" : "transparent"} stroke="black" strokeWidth="1.225" strokeOpacity={isActive('/dashboard') ? "1" : "0.5"} />
             </svg>
           </Link>
    
           {/* Stock */}
           <Link to="/dashboard/inventory" className={cn("w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center rounded-full transition-colors", isActive('/dashboard/inventory') && !location.search ? "bg-[#F0F2F4]" : "hover:bg-gray-50")}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="scale-90 sm:scale-100">
               <path d={svgPaths.pdea4710} stroke="black" strokeLinejoin="round" strokeOpacity={isActive('/dashboard/inventory') && !location.search ? "1" : "0.5"} strokeWidth="1.4" />
             </svg>
           </Link>
    
           {/* Insights (Bulb) */}
           <Link to="/dashboard/pos" className={cn("w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center rounded-full transition-colors", isActive('/dashboard/pos') ? "bg-[#F0F2F4]" : "hover:bg-gray-50")}>
             <ScanLine className={cn("w-5 h-5 sm:w-6 sm:h-6", isActive('/dashboard/pos') ? "text-black" : "text-black/50")} strokeWidth={1.4} />
           </Link>
    
           {/* Menu */}
           <button onClick={() => setSidebarOpen(true)} className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center rounded-full hover:bg-gray-50">
             <div className="flex items-center justify-center w-full h-full">
               <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="scale-90 sm:scale-100">
                 <path clipRule="evenodd" d={svgPaths.p2166df00} fill="black" fillOpacity="0.5" fillRule="evenodd" />
               </svg>
             </div>
           </button>
        </div>
    
        {/* Right: AI Button */}
        <Link to="/dashboard/insights" className="pointer-events-auto bg-white w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center shadow-[0px_0px_44px_0px_rgba(0,0,0,0.16)] transition-transform active:scale-95">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="scale-90 sm:scale-100">
             <path d={svgPaths.p1a0eb580} fill="#0F4C81" />
           </svg>
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