import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, AlertTriangle, Package, ShoppingCart, Users, Info, Clock } from 'lucide-react';
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
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'out_of_stock':
        return <Package className="h-5 w-5 text-red-500" />;
      case 'order_status':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'new_customer':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'expiry':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50"
          >
            <div className="h-full bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#0F4C81]/20 backdrop-blur-sm">
                      <Bell className="h-5 w-5 text-[#0F4C81]" />
                    </div>
                    <div>
                      <h2 className="text-white">Notifications</h2>
                      {unreadCount > 0 && (
                        <p className="text-xs text-white/60">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                      className="flex-1 text-xs text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      Mark all read
                    </Button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
                    <div className="p-4 rounded-full bg-white/5 mb-4">
                      <Bell className="h-8 w-8 text-white/40" />
                    </div>
                    <p className="text-white/60 text-sm">No notifications yet</p>
                    <p className="text-white/40 text-xs mt-1">
                      You'll see updates about your inventory, orders, and more here
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-xl backdrop-blur-sm border transition-all ${
                          notification.read
                            ? 'bg-white/5 border-white/10'
                            : 'bg-white/10 border-white/20'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className={`text-sm ${
                                notification.read ? 'text-white/80' : 'text-white'
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-[#0F4C81] flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-white/60 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-white/40">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-7 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(notification.id)}
                                  className="h-7 px-2 text-white/60 hover:text-red-400 hover:bg-white/10"
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
