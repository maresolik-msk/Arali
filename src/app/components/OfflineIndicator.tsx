import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500/95 to-red-500/95 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-white" />
              <span className="text-xs tracking-wide text-white">
                You're offline • Changes will sync when online
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {showOnlineToast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-white" />
              <span className="text-xs tracking-wide text-white">
                Back online • Syncing data...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
