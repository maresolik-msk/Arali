import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Clock, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';

export function Orders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      <motion.div
        className="p-6 md:p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div>
          <h1 className="text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage all your orders in one place</p>
        </div>

        {/* Coming Soon Card */}
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/20 shadow-2xl p-12 max-w-2xl w-full text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6"
            >
              {/* Icon */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#0F4C81]/10 rounded-full blur-2xl animate-pulse" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5">
                  <ShoppingCart className="w-16 h-16 text-[#0F4C81]" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-[#0F4C81] animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-[#0F4C81] mb-2">Order Management</h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">Coming Soon</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're building a comprehensive order management system. Process orders efficiently, track fulfillment status, and provide excellent customer service.
                </p>
                
                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                    <h4 className="text-[#0F4C81] mb-2">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Quick order creation and status management
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                    <h4 className="text-[#0F4C81] mb-2">Order Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time status updates and delivery tracking
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                    <h4 className="text-[#0F4C81] mb-2">Invoice Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic invoice creation and printing
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0F4C81]/5 border border-[#0F4C81]/10">
                    <h4 className="text-[#0F4C81] mb-2">Payment Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple payment methods and tracking
                    </p>
                  </div>
                </div>
              </div>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0F4C81]/10 to-[#0F4C81]/5 border border-[#0F4C81]/20">
                <Sparkles className="w-4 h-4 text-[#0F4C81]" />
                <span className="text-[#0F4C81] font-medium">Under Development</span>
                <Sparkles className="w-4 h-4 text-[#0F4C81]" />
              </div>
            </motion.div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
