import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, AlertTriangle, Package, ShoppingCart, Users, Info, Clock, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { notificationsApi } from '../../services/api';
import type { Notification } from '../../data/dashboardData';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    let isMounted = true; // Cleanup flag
    
    if (isOpen) {
      loadNotifications();
    }
    
    return () => {
      isMounted = false; // Cleanup on unmount
    };
    
    async function loadNotifications() {
      try {
        setLoading(true);
        const data = await notificationsApi.getAll();
        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
  }, [isOpen]);



  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </div>
        );
      case 'out_of_stock':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-500/30">
            <Package className="h-4 w-4 text-red-400" />
          </div>
        );
      case 'order_status':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30">
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </div>
        );
      case 'new_customer':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30">
            <Users className="h-4 w-4 text-green-400" />
          </div>
        );
      case 'expiry':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-500/30">
            <Clock className="h-4 w-4 text-orange-400" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-sm border border-gray-500/30">
            <Info className="h-4 w-4 text-gray-400" />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-[#0F4C81]/20 backdrop-blur-md z-40"
          />

          {/* Notification Panel - Mobile-First */}
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md z-50"
          >
            {/* Glassmorphic Container */}
            <div className="h-full bg-gradient-to-br from-[#0F4C81]/95 via-[#082032]/95 to-black/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
              
              {/* Ambient Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0F4C81] to-transparent rounded-full blur-3xl" />
              </div>

              {/* Header - Architectural Design */}
              <div className="relative z-10 p-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                {/* Title Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#0F4C81] blur-xl opacity-50" />
                        <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-white tracking-tight">Notifications</h2>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-0.5">
                          Activity Center
                        </p>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#0F4C81]/30 to-[#0F4C81]/20 border border-[#0F4C81]/40 backdrop-blur-sm"
                      >
                        <div className="relative">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#0F4C81] animate-pulse" />
                          <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-[#0F4C81] animate-ping" />
                        </div>
                        <span className="text-[11px] tracking-wide text-white/90">
                          {unreadCount} unread
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="ml-2 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs tracking-wide transition-all ${
                      filter === 'all'
                        ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs tracking-wide transition-all ${
                      filter === 'unread'
                        ? 'bg-white/15 text-white border border-white/20 shadow-lg'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                      className="flex-1 text-[11px] tracking-wide text-white/70 hover:text-white hover:bg-white/10 rounded-xl border border-white/10 disabled:opacity-30"
                    >
                      <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                      Mark all read
                    </Button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1 relative z-10">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 px-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                      <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white/80" />
                    </div>
                    <p className="text-white/40 text-xs tracking-wide mt-4">Loading...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-96 px-6 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
                      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                        {filter === 'unread' ? (
                          <Sparkles className="h-10 w-10 text-white/30" />
                        ) : (
                          <Bell className="h-10 w-10 text-white/30" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-white/80 tracking-tight mb-2">
                      {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                    </h3>
                    <p className="text-white/40 text-xs tracking-wide leading-relaxed max-w-[240px]">
                      {filter === 'unread' 
                        ? 'You have no unread notifications at the moment'
                        : 'You\'ll see updates about your inventory, orders, and more here'
                      }
                    </p>
                  </motion.div>
                ) : (
                  <div className="p-4 space-y-2">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative p-4 rounded-2xl backdrop-blur-sm border transition-all ${
                          notification.read
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-gradient-to-br from-white/15 to-white/10 border-white/20 shadow-lg hover:from-white/20 hover:to-white/15'
                        }`}
                      >
                        {/* Glow effect for unread */}
                        {!notification.read && (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81]/10 to-transparent rounded-2xl blur-xl" />
                        )}
                        
                        <div className="relative flex gap-3">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className={`tracking-tight leading-snug ${
                                notification.read ? 'text-white/70' : 'text-white'
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="relative mt-1">
                                  <div className="h-2 w-2 rounded-full bg-[#0F4C81] shadow-lg" />
                                  <div className="absolute inset-0 h-2 w-2 rounded-full bg-[#0F4C81] animate-ping" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-white/50 mb-3 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] uppercase tracking-[0.1em] text-white/30">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-7 px-2.5 text-[10px] tracking-wide text-white/60 hover:text-white hover:bg-white/15 rounded-lg"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(notification.id)}
                                  className="h-7 px-2.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer - Branding */}
              <div className="relative z-10 p-4 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                    MARESOLIK INC
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}