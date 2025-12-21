import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { Toaster } from '../ui/sonner';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { notificationsApi } from '../../services/api';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: Package,
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
  const { signOut } = useAuth();

  // Load unread notification count
  useEffect(() => {
    loadUnreadCount();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
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
    navigate('/');
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
            {navItems.map((item) => {
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
                  {navItems.map((item) => {
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
        <main className="min-h-[calc(100vh-6rem)]">
          <Outlet />
        </main>
      </div>
      <Toaster />
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={handleNotificationClose}
      />
    </div>
  );
}