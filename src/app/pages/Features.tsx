import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  ShoppingCart, Bell, TrendingUp, Lightbulb, PiggyBank,
  Package, Scan, BarChart3, MessageSquare, Smartphone,
  Shield, Wifi, Globe, Zap, Clock, ArrowRight, ArrowUpRight,
  ArrowDownRight, CheckCircle2, AlertTriangle, Star, Search,
  Plus, Minus, Receipt, Users, FileText, Eye, ChevronRight,
  Sparkles, Target, Layers, RefreshCw, Check, X
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

// ────────────────────────────────────────
// Mock UI Components for Feature Visuals
// ────────────────────────────────────────

function MockInventoryUI() {
  const items = [
    { name: 'Basmati Rice 5kg', sku: 'GR-001', qty: 24, price: '₹320', status: 'good' },
    { name: 'Toor Dal 1kg', sku: 'GR-012', qty: 8, price: '₹145', status: 'low' },
    { name: 'Amul Butter 500g', sku: 'DR-003', qty: 45, price: '₹275', status: 'good' },
    { name: 'Fresh Paneer 200g', sku: 'DR-007', qty: 3, price: '₹90', status: 'critical' },
    { name: 'Sunflower Oil 1L', sku: 'GR-019', qty: 18, price: '₹185', status: 'good' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-[#0F4C81] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package size={18} className="text-white/80" />
            <span className="font-semibold text-sm text-white">Inventory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/15 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Search size={12} className="text-white/60" />
              <span className="text-[11px] text-white/50">Search...</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
              <Plus size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: 'Total Items', val: '156' },
          { label: 'Low Stock', val: '12', color: 'text-amber-500' },
          { label: 'Value', val: '₹2.4L' },
        ].map((s, i) => (
          <div key={i} className="px-4 py-3 text-center">
            <div className={`text-lg font-bold ${s.color || 'text-[#082032]'}`}>{s.val}</div>
            <div className="text-[10px] text-[#082032]/40">{s.label}</div>
          </div>
        ))}
      </div>
      {/* Items */}
      <div className="divide-y divide-gray-50">
        {items.map((item, i) => (
          <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-[#F5F9FC]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.status === 'good' ? 'bg-green-400' : item.status === 'low' ? 'bg-amber-400' : 'bg-red-400'}`} />
              <div>
                <p className="text-xs font-medium text-[#082032]">{item.name}</p>
                <p className="text-[10px] text-[#082032]/30">{item.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#082032]">{item.qty}</p>
              <p className="text-[10px] text-[#082032]/40">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockPOSUI() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#0a3560] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={18} className="text-white/80" />
            <span className="font-semibold text-sm text-white">Point of Sale</span>
          </div>
          <span className="text-[10px] bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full font-medium">Active</span>
        </div>
      </div>
      {/* Cart items */}
      <div className="p-4 space-y-3">
        {[
          { name: 'Basmati Rice 5kg', qty: 2, price: '₹640' },
          { name: 'Toor Dal 1kg', qty: 1, price: '₹145' },
          { name: 'Amul Butter 500g', qty: 3, price: '₹825' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-[#F5F9FC] rounded-xl px-4 py-3">
            <div>
              <p className="text-xs font-medium text-[#082032]">{item.name}</p>
              <p className="text-[10px] text-[#082032]/40">Qty: {item.qty}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#082032]">{item.price}</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 rounded bg-white border border-gray-200 flex items-center justify-center">
                  <Minus size={10} className="text-[#082032]/60" />
                </button>
                <button className="w-5 h-5 rounded bg-white border border-gray-200 flex items-center justify-center">
                  <Plus size={10} className="text-[#082032]/60" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Total */}
      <div className="border-t border-gray-100 p-4 space-y-2">
        <div className="flex justify-between text-xs text-[#082032]/50">
          <span>Subtotal</span><span>₹1,610</span>
        </div>
        <div className="flex justify-between text-xs text-[#082032]/50">
          <span>Tax (5%)</span><span>₹80.50</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#082032] pt-1 border-t border-dashed border-gray-200">
          <span>Total</span><span>₹1,690.50</span>
        </div>
      </div>
      {/* CTA */}
      <div className="px-4 pb-4">
        <div className="bg-[#0F4C81] text-white rounded-xl py-3 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <Receipt size={16} />
          Complete Sale
        </div>
      </div>
    </div>
  );
}

function MockExpiryUI() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-white/80" />
            <span className="font-semibold text-sm text-white">Expiry Alerts</span>
          </div>
          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">7 items</span>
        </div>
      </div>
      {/* Timeline */}
      <div className="p-4 space-y-0">
        {[
          { label: 'Today', items: [{ name: 'Fresh Curd 500g', qty: 4, urgent: true }], color: 'red' },
          { label: 'In 2 Days', items: [{ name: 'Amul Butter 100g', qty: 8, urgent: true }, { name: 'Paneer 200g', qty: 3, urgent: true }], color: 'red' },
          { label: 'In 5 Days', items: [{ name: 'Bread Loaf', qty: 12, urgent: false }], color: 'amber' },
          { label: 'In 7 Days', items: [{ name: 'Cheese Slice Pack', qty: 6, urgent: false }], color: 'green' },
        ].map((group, gi) => (
          <div key={gi} className="flex gap-3">
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center pt-1">
              <div className={`w-3 h-3 rounded-full border-2 ${group.color === 'red' ? 'border-red-400 bg-red-100' : group.color === 'amber' ? 'border-amber-400 bg-amber-100' : 'border-green-400 bg-green-100'}`} />
              {gi < 3 && <div className="w-0.5 flex-1 bg-gray-100 mt-1" />}
            </div>
            {/* Content */}
            <div className="pb-4 flex-1">
              <p className={`text-[11px] font-bold mb-1.5 ${group.color === 'red' ? 'text-red-500' : group.color === 'amber' ? 'text-amber-500' : 'text-green-500'}`}>
                {group.label}
              </p>
              {group.items.map((item, ii) => (
                <div key={ii} className={`flex items-center justify-between rounded-lg px-3 py-2 mb-1 ${group.color === 'red' ? 'bg-red-50/60' : group.color === 'amber' ? 'bg-amber-50/60' : 'bg-green-50/60'}`}>
                  <span className="text-xs text-[#082032]/70">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#082032]/40">×{item.qty}</span>
                    {item.urgent && (
                      <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Discount</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockAnalyticsUI() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a6bb5] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BarChart3 size={18} className="text-white/80" />
            <span className="font-semibold text-sm text-white">Analytics</span>
          </div>
          <span className="text-[10px] text-white/60">This Week</span>
        </div>
      </div>
      {/* Revenue */}
      <div className="p-5">
        <div className="mb-5">
          <p className="text-[10px] text-[#082032]/40 uppercase tracking-wider mb-1">Revenue</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[#082032]">₹84,250</span>
            <span className="flex items-center gap-0.5 text-green-500 text-xs font-medium mb-1">
              <ArrowUpRight size={12} /> +12.5%
            </span>
          </div>
        </div>
        {/* Chart bars */}
        <div className="flex items-end gap-2 h-24 mb-4">
          {[
            { val: 55, label: 'Mon' },
            { val: 70, label: 'Tue' },
            { val: 45, label: 'Wed' },
            { val: 85, label: 'Thu' },
            { val: 60, label: 'Fri' },
            { val: 95, label: 'Sat' },
            { val: 80, label: 'Sun' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-[#0F4C81]/10 relative overflow-hidden" style={{ height: `${bar.val}%` }}>
                <div className="absolute bottom-0 w-full bg-[#0F4C81] rounded-t-md" style={{ height: `${bar.val}%` }} />
              </div>
              <span className="text-[9px] text-[#082032]/30">{bar.label}</span>
            </div>
          ))}
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Transactions', val: '342', icon: Receipt },
            { label: 'Avg. Order', val: '₹246', icon: Target },
            { label: 'Customers', val: '89', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-[#F5F9FC] rounded-xl p-3 text-center">
              <stat.icon size={14} className="text-[#0F4C81]/40 mx-auto mb-1" />
              <p className="text-sm font-bold text-[#082032]">{stat.val}</p>
              <p className="text-[9px] text-[#082032]/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockAIInsightsUI() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-white/80" />
            <span className="font-semibold text-sm text-white">AI Insights</span>
          </div>
          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">3 new</span>
        </div>
      </div>
      {/* Insights */}
      <div className="p-4 space-y-3">
        {[
          {
            type: 'Prediction',
            title: 'Basmati Rice demand will rise 25% next week',
            desc: 'Festival season approaching. Consider stocking 30 extra units.',
            color: 'bg-blue-50 border-blue-100',
            iconColor: 'text-blue-500',
            icon: TrendingUp,
          },
          {
            type: 'Opportunity',
            title: 'Bundle Paneer + Butter for 15% more sales',
            desc: 'Customers who buy paneer also buy butter 73% of the time.',
            color: 'bg-green-50 border-green-100',
            iconColor: 'text-green-500',
            icon: Lightbulb,
          },
          {
            type: 'Alert',
            title: 'Cooking Oil is 40% slower this month',
            desc: 'Price increase may be the cause. Consider a promotional discount.',
            color: 'bg-amber-50 border-amber-100',
            iconColor: 'text-amber-500',
            icon: AlertTriangle,
          },
        ].map((insight, i) => (
          <div key={i} className={`${insight.color} border rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 ${insight.iconColor}`}>
                <insight.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${insight.iconColor}`}>{insight.type}</span>
                </div>
                <p className="text-xs font-semibold text-[#082032] mb-1">{insight.title}</p>
                <p className="text-[11px] text-[#082032]/50 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockNotepadUI() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#0a3560] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-white/80" />
            <span className="font-semibold text-sm text-white">Smart Sales Notepad</span>
          </div>
          <Zap size={14} className="text-amber-300" />
        </div>
      </div>
      {/* Input area */}
      <div className="p-4">
        <div className="bg-[#F5F9FC] rounded-xl p-4 border border-[#0F4C81]/5 mb-3">
          <p className="text-xs text-[#082032]/70 leading-relaxed">
            <span className="text-[#0F4C81] font-medium">Just type naturally:</span>
          </p>
          <p className="text-sm text-[#082032] mt-2 font-mono">
            "sold 3 rice bags, 2 dal packets and 1 oil bottle to Ramesh"
          </p>
        </div>
        {/* AI parsed result */}
        <div className="border border-green-200 bg-green-50/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-[11px] font-semibold text-green-600">AI Parsed Successfully</span>
          </div>
          <div className="space-y-2">
            {[
              { item: 'Basmati Rice 5kg', qty: 3, total: '₹960' },
              { item: 'Toor Dal 1kg', qty: 2, total: '₹290' },
              { item: 'Sunflower Oil 1L', qty: 1, total: '₹185' },
            ].map((parsed, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-[#082032]/70">{parsed.item} ×{parsed.qty}</span>
                <span className="font-semibold text-[#082032]">{parsed.total}</span>
              </div>
            ))}
            <div className="border-t border-green-200 pt-2 mt-2 flex justify-between text-xs font-bold text-[#082032]">
              <span>Customer: Ramesh</span>
              <span>Total: ₹1,435</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────
// Feature Section Component
// ────────────────────────────────────────

interface FeatureSectionProps {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reversed?: boolean;
  bgClass?: string;
}

function FeatureSection({ badge, title, description, bullets, visual, reversed, bgClass = 'bg-white' }: FeatureSectionProps) {
  return (
    <section className={`py-20 md:py-28 ${bgClass} relative overflow-hidden`}>
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-xl"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-5">
              {badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-5 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-[#082032]/60 leading-relaxed mb-8">
              {description}
            </p>
            <ul className="space-y-4">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-[#0F4C81]" />
                  </div>
                  <span className="text-sm text-[#082032]/70 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 flex justify-center"
          >
            {visual}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Comparison Table
// ────────────────────────────────────────

function ComparisonTable() {
  const features = [
    'Inventory Tracking',
    'Expiry Alerts',
    'Point of Sale',
    'Sales Analytics',
    'AI Insights',
    'Offline Mode',
    'Multi-language',
    'WhatsApp Sharing',
    'No Training Needed',
    'Free to Start',
  ];

  const solutions = [
    { name: 'Pen & Paper', icon: FileText, vals: [1, 0, 0, 0, 0, 1, 1, 0, 1, 1] },
    { name: 'Excel', icon: Layers, vals: [1, 0, 0, 1, 0, 1, 0, 0, 0, 1] },
    { name: 'Enterprise', icon: Shield, vals: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'Arali', icon: Sparkles, vals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], highlight: true },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-5">
            How we compare
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-5 leading-tight">
            Arali vs everything else.
          </h2>
          <p className="text-lg text-[#082032]/60">
            Built specifically for small retailers. Not adapted from enterprise tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto overflow-x-auto"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-xs font-medium text-[#082032]/40 uppercase tracking-wider">Feature</th>
                {solutions.map((s, i) => (
                  <th key={i} className={`py-4 px-3 text-center ${s.highlight ? 'bg-[#0F4C81] rounded-t-2xl' : ''}`}>
                    <div className={`flex flex-col items-center gap-1.5 ${s.highlight ? 'text-white' : 'text-[#082032]/60'}`}>
                      <s.icon size={18} />
                      <span className="text-xs font-semibold">{s.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, fi) => (
                <tr key={fi} className="border-t border-[#0F4C81]/5">
                  <td className="py-3.5 px-4 text-sm text-[#082032]/70">{feat}</td>
                  {solutions.map((s, si) => (
                    <td key={si} className={`py-3.5 px-3 text-center ${s.highlight ? 'bg-[#0F4C81]/5' : ''} ${fi === features.length - 1 && s.highlight ? 'rounded-b-2xl' : ''}`}>
                      {s.vals[fi] ? (
                        <Check size={16} className={`mx-auto ${s.highlight ? 'text-[#0F4C81]' : 'text-green-400'}`} />
                      ) : (
                        <X size={16} className="mx-auto text-gray-200" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Works Everywhere Section
// ────────────────────────────────────────

function WorksEverywhere() {
  return (
    <section className="py-20 md:py-28 bg-[#0F4C81] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wider uppercase mb-5">
            Install anywhere
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold mb-5 leading-tight">
            Your shop, on every screen.
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Arali is a Progressive Web App — works on any phone, tablet, or computer. No app store needed. Just open and install.
          </p>
        </motion.div>

        {/* Device mockups */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 md:order-1"
          >
            <div className="w-40 md:w-48 bg-[#082032] rounded-[20px] p-2 shadow-2xl shadow-black/30 border border-white/10">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
              <div className="bg-white rounded-[14px] overflow-hidden aspect-[9/16]">
                <div className="bg-[#0F4C81] px-3 py-2 flex items-center gap-1.5">
                  <Package size={10} className="text-white/70" />
                  <span className="text-[8px] font-semibold text-white">Arali</span>
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="bg-[#F5F9FC] rounded-lg p-2">
                    <p className="text-[7px] text-[#082032]/40 mb-0.5">Today's Sales</p>
                    <p className="text-sm font-bold text-[#082032]">₹12,450</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <p className="text-[7px] text-amber-600 mb-0.5">Expiring Soon</p>
                    <p className="text-[8px] font-medium text-[#082032]">3 items need attention</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-[#0F4C81] rounded-lg p-1.5 text-center">
                      <ShoppingCart size={10} className="text-white mx-auto mb-0.5" />
                      <p className="text-[6px] text-white">New Sale</p>
                    </div>
                    <div className="bg-[#F5F9FC] rounded-lg p-1.5 text-center">
                      <Scan size={10} className="text-[#0F4C81] mx-auto mb-0.5" />
                      <p className="text-[6px] text-[#0F4C81]">Scan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-white/40 mt-3 font-medium">Phone</p>
          </motion.div>

          {/* Laptop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="w-72 md:w-96 bg-[#082032] rounded-t-[12px] p-2 shadow-2xl shadow-black/30 border border-white/10 border-b-0">
              <div className="flex items-center gap-1 mb-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <div className="flex-1 bg-white/10 rounded ml-2 px-2 py-0.5">
                  <span className="text-[7px] text-white/40">arali.app/dashboard</span>
                </div>
              </div>
              <div className="bg-white rounded-[6px] overflow-hidden aspect-[16/10]">
                <div className="flex h-full">
                  {/* Sidebar */}
                  <div className="w-14 bg-[#0F4C81] py-3 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                      <span className="text-[8px] font-bold text-white">A</span>
                    </div>
                    {[BarChart3, Package, ShoppingCart, Users, Bell].map((Icon, i) => (
                      <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-white/20' : ''}`}>
                        <Icon size={10} className="text-white/60" />
                      </div>
                    ))}
                  </div>
                  {/* Main content */}
                  <div className="flex-1 p-2">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[8px] font-bold text-[#082032]">Dashboard</p>
                      <div className="bg-[#F5F9FC] rounded px-1.5 py-0.5">
                        <p className="text-[6px] text-[#082032]/40">Today</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      {[
                        { label: 'Revenue', val: '₹84.2K' },
                        { label: 'Orders', val: '342' },
                        { label: 'Items', val: '1,256' },
                      ].map((s, i) => (
                        <div key={i} className="bg-[#F5F9FC] rounded p-1.5 text-center">
                          <p className="text-[8px] font-bold text-[#082032]">{s.val}</p>
                          <p className="text-[5px] text-[#082032]/40">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Chart */}
                    <div className="flex items-end gap-0.5 h-10">
                      {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-[#0F4C81]/15 rounded-t-sm relative overflow-hidden">
                          <div className="absolute bottom-0 w-full bg-[#0F4C81] rounded-t-sm" style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-80 md:w-[440px] h-3 bg-[#1a2a3a] rounded-b-lg mx-auto border-x border-b border-white/10" />
            <p className="text-center text-xs text-white/40 mt-3 font-medium">Desktop</p>
          </motion.div>

          {/* Tablet */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-3"
          >
            <div className="w-48 md:w-56 bg-[#082032] rounded-[16px] p-2 shadow-2xl shadow-black/30 border border-white/10">
              <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-1.5" />
              <div className="bg-white rounded-[10px] overflow-hidden aspect-[3/4]">
                <div className="bg-[#0F4C81] px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Package size={10} className="text-white/70" />
                    <span className="text-[8px] font-semibold text-white">Arali POS</span>
                  </div>
                  <span className="text-[7px] text-white/40">Tablet Mode</span>
                </div>
                <div className="p-2 space-y-1.5">
                  {['Basmati Rice ×2 — ₹640', 'Toor Dal ×1 — ₹145', 'Butter ×3 — ₹825'].map((item, i) => (
                    <div key={i} className="bg-[#F5F9FC] rounded-lg px-2 py-1.5">
                      <p className="text-[7px] text-[#082032]/70">{item}</p>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-1.5 flex justify-between">
                    <span className="text-[8px] font-bold text-[#082032]">Total</span>
                    <span className="text-[8px] font-bold text-[#082032]">₹1,610</span>
                  </div>
                  <div className="bg-[#0F4C81] rounded-lg py-1.5 text-center">
                    <span className="text-[7px] font-semibold text-white">Complete Sale</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-white/40 mt-3 font-medium">Tablet</p>
          </motion.div>
        </div>

        {/* Install badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-14"
        >
          {['Android', 'iOS', 'Windows', 'macOS', 'ChromeOS'].map((os, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Smartphone size={14} className="text-white/50" />
              <span className="text-xs text-white/60">{os}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Quick Feature Grid for secondary features
// ────────────────────────────────────────

function SecondaryFeatures() {
  const features = [
    { icon: Scan, title: 'Barcode Scanner', desc: 'Point, scan, done. Add products by scanning their barcode with your phone camera.' },
    { icon: MessageSquare, title: 'WhatsApp Sharing', desc: 'Share stock updates and offers with customers directly on WhatsApp.' },
    { icon: Globe, title: 'Multi-language', desc: 'Use Arali in English, Hindi, Telugu, or Kannada. Your shop, your language.' },
    { icon: Wifi, title: 'Offline Mode', desc: 'Works even without internet. Data syncs automatically when reconnected.' },
    { icon: Shield, title: 'Bank-level Security', desc: 'Your data is encrypted and backed up. Only you can access your information.' },
    { icon: Users, title: 'Customer Management', desc: 'Track regular customers, their purchase history, and outstanding credit.' },
    { icon: RefreshCw, title: 'Auto Backups', desc: 'Your data is automatically backed up to the cloud every single day.' },
    { icon: Eye, title: 'Vendor Tracking', desc: 'Keep records of all your suppliers, their products, prices, and delivery schedules.' },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-5">
            And much more
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] leading-tight">
            Every detail, considered.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-[#F5F9FC] rounded-2xl p-6 border border-[#0F4C81]/5 hover:border-[#0F4C81]/15 hover:shadow-lg hover:shadow-[#0F4C81]/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center mb-4 group-hover:bg-[#0F4C81] group-hover:text-white transition-colors duration-300 text-[#0F4C81]">
                <f.icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-[#082032] mb-2">{f.title}</h3>
              <p className="text-xs text-[#082032]/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Main Features Page
// ────────────────────────────────────────

export function Features() {
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-[#F5F9FC] to-white overflow-hidden pt-8 pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#0F4C81]/3 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0F4C81]/3 rounded-full blur-[120px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #0F4C81 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0F4C81]/10 bg-white/70 backdrop-blur-sm text-[#0F4C81] text-xs font-medium uppercase tracking-widest mb-8"
            >
              <Sparkles size={14} />
              Features
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#0F4C81] leading-[0.95] mb-8"
            >
              Powerful, yet<br />
              <span className="text-[#0F4C81]/40">delightfully simple.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-[#082032]/50 font-light leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Every feature designed for real shop owners — not tech experts. See exactly how Arali transforms your daily operations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/login">
                <Button className="h-14 px-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg rounded-full shadow-xl shadow-[#0F4C81]/10 transition-transform hover:scale-[1.02]">
                  Try it free
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="h-14 px-10 text-[#0F4C81] hover:bg-[#0F4C81]/5 text-lg rounded-full">
                  View pricing
                </Button>
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-16 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-[#082032]/30 uppercase tracking-wider">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-8 rounded-full border-2 border-[#0F4C81]/15 flex items-start justify-center p-1"
              >
                <div className="w-1 h-2 rounded-full bg-[#0F4C81]/30" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Count Strip */}
      <section className="py-5 bg-white border-y border-[#0F4C81]/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
          >
            {[
              { val: '6', label: 'Core Modules' },
              { val: '20+', label: 'Features' },
              { val: '4', label: 'Languages' },
              { val: '5', label: 'Platforms' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-2xl font-bold text-[#0F4C81]">{s.val}</span>
                <span className="text-sm text-[#082032]/40">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Feature Deep Dives ── */}

      {/* 1. Inventory Management */}
      <FeatureSection
        badge="Inventory Management"
        title="Know every item in your shop. Always."
        description="Track every product from the moment it arrives to the moment it sells. No more guessing, no more notebooks."
        bullets={[
          'Add products instantly with barcode scan or manual entry',
          'Real-time stock levels with color-coded status indicators',
          'Category-based organization (Grocery, Dairy, Snacks, etc.)',
          'Purchase history and cost tracking for every item',
          'Low-stock alerts so you never run out of best sellers',
        ]}
        visual={<MockInventoryUI />}
        bgClass="bg-white"
      />

      {/* 2. Point of Sale */}
      <FeatureSection
        badge="Point of Sale"
        title="Ring up sales in seconds. Not minutes."
        description="A clean, fast POS designed for busy shop counters. Process sales, apply discounts, and generate receipts — all from your phone."
        bullets={[
          'Quick-add items from your inventory with search or scan',
          'Apply percentage or flat discounts per item or cart',
          'Digital receipts shared via WhatsApp or SMS',
          'Cash, UPI, and card payment tracking',
          'Daily sales summary generated automatically',
        ]}
        visual={<MockPOSUI />}
        reversed
        bgClass="bg-[#F5F9FC]"
      />

      {/* 3. Expiry Tracking */}
      <FeatureSection
        badge="Expiry Tracking"
        title="Never throw money in the bin again."
        description="Get smart alerts days before items expire. Create instant discounts to move perishable stock and minimize losses."
        bullets={[
          'Automatic alerts at 7, 3, and 1 day before expiry',
          'Visual timeline showing all upcoming expirations',
          'One-tap discount creation for near-expiry items',
          'WhatsApp notification to customers about flash deals',
          'Monthly waste report showing money you saved',
        ]}
        visual={<MockExpiryUI />}
        bgClass="bg-white"
      />

      {/* 4. Analytics Dashboard */}
      <FeatureSection
        badge="Analytics"
        title="See your numbers. Understand your business."
        description="Simple, beautiful charts that tell you exactly how your shop is performing. No spreadsheets, no confusion."
        bullets={[
          'Daily, weekly, and monthly revenue charts',
          'Top selling products and slow-moving inventory',
          'Profit margin tracking per category',
          'Customer visit frequency and spending patterns',
          'Exportable reports for tax and accounting',
        ]}
        visual={<MockAnalyticsUI />}
        reversed
        bgClass="bg-[#F5F9FC]"
      />

      {/* 5. AI Insights */}
      <FeatureSection
        badge="AI-Powered"
        title="Your smartest business advisor. Built-in."
        description="Arali's AI analyzes your sales patterns and gives you actionable predictions — when to stock up, what to discount, and how to grow."
        bullets={[
          'Demand prediction based on seasonal trends and history',
          'Smart product bundling suggestions to boost sales',
          'Slow-mover detection with recommended actions',
          'Festival and weather-based inventory recommendations',
          'Revenue forecasting for the next 30 days',
        ]}
        visual={<MockAIInsightsUI />}
        bgClass="bg-white"
      />

      {/* 6. Smart Notepad */}
      <FeatureSection
        badge="Smart Notepad"
        title="Type like you talk. Arali understands."
        description="Log sales the way you think — in natural language. Just type or speak what happened, and Arali creates the perfect record."
        bullets={[
          'Natural language processing for sales entries',
          'Voice input support for hands-free logging',
          'Automatic product matching from your inventory',
          'Customer name recognition and credit tracking',
          'Instant conversion to structured sales records',
        ]}
        visual={<MockNotepadUI />}
        reversed
        bgClass="bg-[#F5F9FC]"
      />

      {/* Comparison Table */}
      <ComparisonTable />

      {/* Works Everywhere */}
      <WorksEverywhere />

      {/* Secondary Features Grid */}
      <SecondaryFeatures />

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#F5F9FC]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              Ready to see it yourself?
            </h2>
            <p className="text-xl text-[#082032]/50 max-w-xl mx-auto mb-10">
              Start free. No credit card. No complex setup. Just open Arali and start managing your shop the smart way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="h-14 px-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg rounded-full shadow-xl shadow-[#0F4C81]/10 transition-transform hover:scale-[1.02]">
                  Start for free
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="ghost" className="h-14 px-10 text-[#0F4C81] hover:bg-[#0F4C81]/5 text-lg rounded-full">
                  See how it works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}