import React from 'react';
import { motion } from 'motion/react';
import {
  Package, AlertTriangle, TrendingUp, BarChart3, ShoppingCart,
  Bell, Scan, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2
} from 'lucide-react';

// Mock UI cards that look like the actual app dashboard
function InventoryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
            <Package size={16} className="text-[#0F4C81]" />
          </div>
          <span className="font-semibold text-sm text-[#082032]">Inventory</span>
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Live</span>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Basmati Rice 5kg', qty: 24, status: 'good' },
          { name: 'Toor Dal 1kg', qty: 8, status: 'low' },
          { name: 'Sunflower Oil 1L', qty: 45, status: 'good' },
          { name: 'Wheat Flour 10kg', qty: 3, status: 'critical' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-xs text-[#082032]/70">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#082032]">{item.qty}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'good' ? 'bg-green-400' : item.status === 'low' ? 'bg-amber-400' : 'bg-red-400'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpiryAlertCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <span className="font-semibold text-sm text-[#082032]">Expiry Alerts</span>
        </div>
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">3 items</span>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Amul Butter 500g', days: 2, urgent: true },
          { name: 'Fresh Paneer 200g', days: 4, urgent: true },
          { name: 'Curd 1kg Pack', days: 7, urgent: false },
        ].map((item, i) => (
          <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl ${item.urgent ? 'bg-red-50/60' : 'bg-amber-50/60'}`}>
            <div className="flex items-center gap-2">
              <Clock size={12} className={item.urgent ? 'text-red-400' : 'text-amber-400'} />
              <span className="text-xs text-[#082032]/80">{item.name}</span>
            </div>
            <span className={`text-xs font-bold ${item.urgent ? 'text-red-500' : 'text-amber-500'}`}>
              {item.days}d left
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-[#0F4C81]" />
          </div>
          <span className="font-semibold text-sm text-[#082032]">Today's Sales</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-3xl font-bold text-[#082032]">₹12,450</div>
        <div className="flex items-center gap-1 mt-1">
          <ArrowUpRight size={14} className="text-green-500" />
          <span className="text-xs text-green-600 font-medium">+18% from yesterday</span>
        </div>
      </div>
      {/* Mini bar chart */}
      <div className="flex items-end gap-1.5 h-16">
        {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-[#0F4C81]/15 relative overflow-hidden">
            <div
              className="absolute bottom-0 w-full rounded-t-sm bg-[#0F4C81]"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-[#082032]/30">8 AM</span>
        <span className="text-[10px] text-[#082032]/30">Now</span>
      </div>
    </div>
  );
}

function QuickActionCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
            <Scan size={16} className="text-[#0F4C81]" />
          </div>
          <span className="font-semibold text-sm text-[#082032]">Quick Actions</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: ShoppingCart, label: 'New Sale', color: 'bg-[#0F4C81]', textColor: 'text-white' },
          { icon: Package, label: 'Add Stock', color: 'bg-[#0F4C81]/10', textColor: 'text-[#0F4C81]' },
          { icon: Scan, label: 'Scan Item', color: 'bg-[#0F4C81]/10', textColor: 'text-[#0F4C81]' },
          { icon: BarChart3, label: 'Reports', color: 'bg-[#0F4C81]/10', textColor: 'text-[#0F4C81]' },
        ].map((action, i) => (
          <div key={i} className={`${action.color} ${action.textColor} rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer`}>
            <action.icon size={20} />
            <span className="text-[11px] font-medium">{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationToast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-8 bg-white rounded-xl shadow-2xl shadow-[#0F4C81]/15 border border-[#0F4C81]/10 p-3.5 max-w-[220px] z-20"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
          <Bell size={12} className="text-amber-500" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#082032]">Expiry Warning</p>
          <p className="text-[10px] text-[#082032]/60 leading-relaxed">
            5 items expiring within 3 days. Tap to create discount.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 1 }}
      className="absolute -top-3 -left-3 md:top-4 md:-left-6 bg-green-500 text-white rounded-full px-3 py-1.5 shadow-lg shadow-green-500/30 flex items-center gap-1.5 z-20"
    >
      <CheckCircle2 size={14} />
      <span className="text-[11px] font-semibold">Sale recorded!</span>
    </motion.div>
  );
}

export function AppPreview() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white via-[#F5F9FC] to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#0F4C81]/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#0F4C81]/3 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            See it in action
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Your entire shop,<br />on one screen.
          </h2>
          <p className="text-xl text-[#082032]/60 leading-relaxed">
            From inventory to sales to expiry alerts — everything a shop owner needs, designed to be understood at a glance.
          </p>
        </motion.div>

        {/* App mockup grid */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {/* Inventory Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <InventoryCard />
            </motion.div>

            {/* Sales Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center relative"
            >
              <SalesCard />
              <SuccessBadge />
            </motion.div>

            {/* Expiry Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center relative"
            >
              <ExpiryAlertCard />
              <NotificationToast />
            </motion.div>
          </div>

          {/* Quick Action Card - centered below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-6"
          >
            <QuickActionCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
