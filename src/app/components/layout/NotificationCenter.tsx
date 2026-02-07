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
    let isMounted = true;
    
    if (isOpen) {
      loadNotifications();
    }
    
    return () => {
      isMounted = false;
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
          <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-100">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </div>
        );
      case 'out_of_stock':
        return (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-100">
            <Package className="h-4 w-4 text-red-600" />
          </div>
        );
      case 'order_status':
        return (
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </div>
        );
      case 'new_customer':
        return (
          <div className="p-2.5 rounded-xl bg-green-50 border border-green-100">
            <Users className="h-4 w-4 text-green-600" />
          </div>
        );
      case 'expiry':
        return (
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <Info className="h-4 w-4 text-gray-600" />
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
          {/* Simple Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Notification Panel */}
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
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md z-50 bg-white shadow-2xl flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-white z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#0F4C81]">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-gray-900 font-semibold tracking-tight">Notifications</h2>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mt-0.5">
                        Activity Center
                      </p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0F4C81]">
                      <div className="relative">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#0F4C81] animate-pulse" />
                      </div>
                      <span className="text-[11px] font-medium tracking-wide">
                        {unreadCount} unread
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="text-[11px] text-gray-500 hover:text-[#0F4C81] hover:bg-blue-50"
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                    Mark all read
                  </Button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1 bg-gray-50/50">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 px-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#0F4C81]" />
                  <p className="text-gray-400 text-xs mt-4">Loading...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 px-6 text-center">
                  <div className="mb-6 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                    {filter === 'unread' ? (
                      <Sparkles className="h-10 w-10 text-gray-300" />
                    ) : (
                      <Bell className="h-10 w-10 text-gray-300" />
                    )}
                  </div>
                  <h3 className="text-gray-900 font-medium mb-2">
                    {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                  </h3>
                  <p className="text-gray-500 text-xs max-w-[240px]">
                    {filter === 'unread' 
                      ? 'You have no unread notifications at the moment'
                      : 'You\'ll see updates about your inventory, orders, and more here'
                    }
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`group relative p-4 rounded-xl border transition-all ${
                        notification.read
                          ? 'bg-white border-gray-100'
                          : 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50'
                      }`}
                    >
                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#0F4C81] rounded-r-full" />
                      )}
                      
                      <div className="flex gap-3 pl-2">
                        <div className="flex-shrink-0 pt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`text-sm font-medium leading-tight ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-7 px-2.5 text-[10px] text-gray-500 hover:text-[#0F4C81] hover:bg-blue-50"
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="h-7 px-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[9px] uppercase tracking-[0.15em] text-gray-300 font-medium">
                  Maresolik Inc
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}