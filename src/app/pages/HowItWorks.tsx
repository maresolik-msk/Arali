import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  Plus, Bell, ChartColumn, Clock, ArrowRight, ArrowDown,
  Smartphone, Package, AlertTriangle, TrendingUp,
  Check, ChevronDown, ChevronUp, Search, Zap,
  Star, Sun, Moon, Coffee, ShoppingCart, BarChart3,
  Scan, Camera, Type, Mic, Timer, Shield, Wifi, WifiOff,
  CircleCheck, CircleAlert, CircleMinus, Sparkles,
  CalendarDays, X, Heart
} from 'lucide-react';

// ────────────────────────────────────────
// Hero Section
// ────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-[#F5F9FC] to-white overflow-hidden pt-8 pb-20">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0F4C81]/3 rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #0F4C81 1px, transparent 1px)',
          backgroundSize: '48px 48px'
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
            <Zap size={14} className="fill-[#0F4C81]" />
            How it works
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#0F4C81] leading-[0.95] mb-8"
          >
            4 steps. 5 minutes.<br />
            <span className="text-[#0F4C81]/40">Your shop transforms.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#082032]/50 font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            No training required. No tech skills needed. If you can use WhatsApp, you can use Arali.
          </motion.p>

          {/* Mini step preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
          >
            {[
              { num: '1', label: 'Add stock', icon: Plus },
              { num: '2', label: 'Watch freshness', icon: Clock },
              { num: '3', label: 'Get alerts', icon: Bell },
              { num: '4', label: 'See growth', icon: ChartColumn },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-[#0F4C81]/10 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#0F4C81] flex items-center justify-center text-white text-xs font-bold">
                  {step.num}
                </div>
                <span className="text-sm font-medium text-[#082032]/70">{step.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center gap-2 text-[#0F4C81]/30"
          >
            <span className="text-xs tracking-wider uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Step 1: Add Your Stock — Mock product entry UI
// ────────────────────────────────────────

function Step1() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C81] flex items-center justify-center text-white font-bold text-lg">1</div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C81]/50">Step one</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              Add your stock in seconds.
            </h2>
            <p className="text-lg text-[#082032]/60 leading-relaxed mb-8">
              No complex forms. No mandatory fields. Just tap "Add Product," type a name, set a price, and you are done. Want to add expiry dates or categories? You can — but you do not have to.
            </p>

            {/* Input methods */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Type, label: 'Type it', desc: 'Fastest way — just type the name' },
                { icon: Scan, label: 'Scan barcode', desc: 'Point your camera at any barcode' },
                { icon: Mic, label: 'Say it', desc: 'Voice input in your language' },
                { icon: Camera, label: 'Photo entry', desc: 'Snap a photo of the product' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F9FC] border border-[#0F4C81]/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] shrink-0">
                    <m.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#082032]">{m.label}</p>
                    <p className="text-[10px] text-[#082032]/40">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-[#0F4C81]/60">
              <Timer size={14} />
              <span>Average time to add one product: <strong className="text-[#0F4C81]">8 seconds</strong></span>
            </div>
          </motion.div>

          {/* Mock UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden max-w-md mx-auto">
              {/* App header */}
              <div className="bg-[#0F4C81] px-5 py-4 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Add Product</span>
                <X size={18} className="text-white/60" />
              </div>

              <div className="p-5 space-y-4">
                {/* Product name */}
                <div>
                  <label className="text-xs font-medium text-[#082032]/50 mb-1.5 block">Product Name</label>
                  <div className="border border-[#0F4C81]/15 rounded-xl px-4 py-3 bg-[#F5F9FC]/50">
                    <span className="text-sm text-[#082032]">Amul Butter 500g</span>
                    <span className="inline-block w-0.5 h-4 bg-[#0F4C81] ml-0.5 animate-pulse align-middle" />
                  </div>
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#082032]/50 mb-1.5 block">Buy Price</label>
                    <div className="border border-[#0F4C81]/15 rounded-xl px-4 py-3 bg-[#F5F9FC]/50">
                      <span className="text-sm text-[#082032]">&#8377;245</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#082032]/50 mb-1.5 block">Sell Price</label>
                    <div className="border border-[#0F4C81]/15 rounded-xl px-4 py-3 bg-[#F5F9FC]/50">
                      <span className="text-sm text-[#082032]">&#8377;280</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-[#082032]/50 mb-1.5 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Dairy', 'Snacks', 'Beverages', 'Grains'].map((cat, ci) => (
                      <span
                        key={ci}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${ci === 0 ? 'bg-[#0F4C81] text-white' : 'bg-[#F5F9FC] text-[#082032]/50 border border-[#0F4C81]/10'}`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expiry */}
                <div>
                  <label className="text-xs font-medium text-[#082032]/50 mb-1.5 block">Expiry Date (optional)</label>
                  <div className="border border-[#0F4C81]/15 rounded-xl px-4 py-3 bg-[#F5F9FC]/50 flex items-center justify-between">
                    <span className="text-sm text-[#082032]">15 Mar 2026</span>
                    <CalendarDays size={14} className="text-[#0F4C81]/40" />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-medium text-[#082032]/50 mb-1.5 block">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-xl bg-[#F5F9FC] border border-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] font-bold">-</button>
                    <span className="text-lg font-bold text-[#082032] w-8 text-center">12</span>
                    <button className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 border border-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] font-bold">+</button>
                  </div>
                </div>

                {/* Save button */}
                <button className="w-full py-3.5 bg-[#0F4C81] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#0F4C81]/20 flex items-center justify-center gap-2 mt-2">
                  <Check size={16} />
                  Save Product
                </button>

                {/* Profit badge */}
                <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-green-50 border border-green-100">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs font-medium text-green-600">Profit margin: &#8377;35 per unit (14.3%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Step 2: Watch Freshness — Mock inventory list
// ────────────────────────────────────────

function Step2() {
  const products = [
    { name: 'Amul Butter 500g', qty: 12, expiry: '15 Mar 2026', daysLeft: 30, status: 'fresh' as const },
    { name: 'Britannia Bread', qty: 8, expiry: '18 Feb 2026', daysLeft: 6, status: 'warning' as const },
    { name: 'Mother Dairy Curd', qty: 5, expiry: '14 Feb 2026', daysLeft: 2, status: 'danger' as const },
    { name: 'Parle-G Biscuits', qty: 24, expiry: '10 Aug 2026', daysLeft: 178, status: 'fresh' as const },
    { name: 'Haldiram Mixture', qty: 15, expiry: '22 Apr 2026', daysLeft: 69, status: 'fresh' as const },
    { name: 'Nestle Milk 1L', qty: 3, expiry: '13 Feb 2026', daysLeft: 1, status: 'danger' as const },
  ];

  const statusConfig = {
    fresh: { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-400', label: 'Fresh' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', label: 'Expiring soon' },
    danger: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400', label: 'Urgent' },
  };

  return (
    <section className="py-24 md:py-32 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C81] flex items-center justify-center text-white font-bold text-lg">2</div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C81]/50">Step two</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              Watch freshness at a glance.
            </h2>
            <p className="text-lg text-[#082032]/60 leading-relaxed mb-8">
              Your entire inventory, color-coded by freshness. Green means safe. Amber means act soon. Red means act now. No reading spreadsheets — just look at the colors.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { color: 'bg-green-400', label: 'Fresh', desc: 'More than 7 days until expiry' },
                { color: 'bg-amber-400', label: 'Expiring soon', desc: '3-7 days — consider a discount' },
                { color: 'bg-red-400', label: 'Urgent', desc: 'Less than 3 days — act now or lose it' },
              ].map((legend, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${legend.color}`} />
                  <span className="text-sm font-semibold text-[#082032]/70 w-28">{legend.label}</span>
                  <span className="text-xs text-[#082032]/40">{legend.desc}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-[#0F4C81]/60">
              <Search size={14} />
              <span>Search across <strong className="text-[#0F4C81]">5,000+ products</strong> instantly</span>
            </div>
          </motion.div>

          {/* Mock UI — Inventory list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden max-w-md mx-auto">
              {/* App header */}
              <div className="bg-[#0F4C81] px-5 py-4 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Inventory</span>
                <div className="flex items-center gap-2">
                  <div className="bg-white/15 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    <Search size={12} className="text-white/60" />
                    <span className="text-xs text-white/40">Search...</span>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="px-5 py-3 flex gap-2 border-b border-[#0F4C81]/5 overflow-x-auto">
                {['All (68)', 'Urgent (2)', 'Expiring (1)', 'Fresh (65)'].map((tab, ti) => (
                  <span
                    key={ti}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${ti === 0 ? 'bg-[#0F4C81] text-white' : 'bg-[#F5F9FC] text-[#082032]/40'}`}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              {/* Product list */}
              <div className="divide-y divide-[#0F4C81]/5">
                {products.map((p, pi) => {
                  const cfg = statusConfig[p.status];
                  return (
                    <motion.div
                      key={pi}
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: pi * 0.05 }}
                      className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#F5F9FC]/50 transition-colors"
                    >
                      <div className={`w-2 h-8 rounded-full ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#082032] truncate">{p.name}</p>
                        <p className="text-[10px] text-[#082032]/35">Qty: {p.qty} &middot; Exp: {p.expiry}</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
                        {p.daysLeft}d
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom summary */}
              <div className="px-5 py-3.5 bg-[#F5F9FC] flex items-center justify-between border-t border-[#0F4C81]/5">
                <span className="text-[10px] text-[#082032]/40">68 products tracked</span>
                <span className="text-[10px] font-medium text-red-500">2 need immediate attention</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Step 3: Get Alerts — Mock notification UI
// ────────────────────────────────────────

function Step3() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C81] flex items-center justify-center text-white font-bold text-lg">3</div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C81]/50">Step three</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              Act before it expires.
            </h2>
            <p className="text-lg text-[#082032]/60 leading-relaxed mb-8">
              Arali does not just tell you something is expiring — it tells you what to do about it. Discount it, bundle it, push it to the front shelf, or share a WhatsApp offer. Real suggestions, not just red warnings.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Bell, title: 'Smart alerts', desc: 'Get notified 7 days, 3 days, and 1 day before expiry' },
                { icon: Sparkles, title: 'Action suggestions', desc: 'Arali recommends what to do — not just what is wrong' },
                { icon: ShoppingCart, title: 'One-tap offers', desc: 'Create a WhatsApp discount post in one tap' },
              ].map((f, fi) => (
                <motion.div
                  key={fi}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + fi * 0.08 }}
                  className="flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] shrink-0">
                    <f.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#082032]">{f.title}</p>
                    <p className="text-xs text-[#082032]/45">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mock UI — Notification center */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="space-y-4 max-w-md mx-auto">
              {/* Urgent notification */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl shadow-red-500/10 border border-red-100 p-5"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Urgent</span>
                      <span className="text-[10px] text-[#082032]/30">2 min ago</span>
                    </div>
                    <p className="text-sm font-semibold text-[#082032] mb-1">3 items expire tomorrow</p>
                    <p className="text-xs text-[#082032]/50 mb-3">Nestle Milk 1L (3 units), Mother Dairy Curd (5 units)</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium">Create discount</button>
                      <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium">Share on WhatsApp</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Warning notification */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-white rounded-2xl shadow-xl shadow-amber-500/10 border border-amber-100 p-5"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Heads up</span>
                      <span className="text-[10px] text-[#082032]/30">1 hr ago</span>
                    </div>
                    <p className="text-sm font-semibold text-[#082032] mb-1">Britannia Bread expires in 6 days</p>
                    <p className="text-xs text-[#082032]/50 mb-3">8 units remaining. Consider moving to front shelf.</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium">Move to front</button>
                      <button className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs font-medium">Bundle offer</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* AI suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 p-5"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">AI Insight</span>
                      <span className="text-[10px] text-[#082032]/30">Today</span>
                    </div>
                    <p className="text-sm font-semibold text-[#082032] mb-1">Low stock alert: Amul Butter</p>
                    <p className="text-xs text-[#082032]/50 mb-3">You sell ~4 units/week. Current stock (12) will last ~3 weeks. Reorder suggested by 5 Mar.</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-[#0F4C81] text-white text-xs font-medium">Add to order list</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Step 4: See Your Progress — Mock dashboard
// ────────────────────────────────────────

function Step4() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#0F4C81] flex items-center justify-center text-white font-bold text-lg">4</div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0F4C81]/50">Step four</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              See your progress every week.
            </h2>
            <p className="text-lg text-[#082032]/60 leading-relaxed mb-8">
              Every Sunday, Arali sends you a simple report. How much you saved. What sold well. What needs attention. Real numbers, not confusing charts. Know exactly how your shop is doing.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: BarChart3, title: 'Weekly report', desc: 'Sent every Sunday at 8 AM — no login needed' },
                { icon: TrendingUp, title: 'Waste prevented', desc: 'See exactly how much money you saved this week' },
                { icon: Star, title: 'Best sellers', desc: 'Know which products are flying off the shelves' },
              ].map((f, fi) => (
                <motion.div
                  key={fi}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + fi * 0.08 }}
                  className="flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] shrink-0">
                    <f.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#082032]">{f.title}</p>
                    <p className="text-xs text-[#082032]/45">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mock UI — Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 overflow-hidden max-w-md mx-auto">
              {/* App header */}
              <div className="bg-[#0F4C81] px-5 py-4 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Weekly Report</span>
                <span className="text-white/50 text-xs">Feb 6 - Feb 12</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Savings card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 border border-green-100">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Waste prevented</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-green-600">&#8377;2,140</span>
                    <span className="text-sm text-green-500">this week</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-500">18% better than last week</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Items sold', value: '142', change: '+12%' },
                    { label: 'Revenue', value: '&#8377;18.4K', change: '+8%' },
                    { label: 'Expired', value: '2', change: '-60%' },
                  ].map((s, si) => (
                    <div key={si} className="bg-[#F5F9FC] rounded-xl p-3 text-center">
                      <p className="text-[10px] text-[#082032]/40 mb-1">{s.label}</p>
                      <p className="text-lg font-bold text-[#082032]" dangerouslySetInnerHTML={{ __html: s.value }} />
                      <p className="text-[10px] font-medium text-green-500">{s.change}</p>
                    </div>
                  ))}
                </div>

                {/* Mini bar chart */}
                <div>
                  <p className="text-xs font-semibold text-[#082032]/60 mb-3">Daily Sales (This week)</p>
                  <div className="flex items-end gap-2 h-24">
                    {[45, 62, 38, 78, 55, 85, 70].map((h, hi) => (
                      <div key={hi} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 + hi * 0.05 }}
                          className={`w-full rounded-t-md ${hi === 5 ? 'bg-[#0F4C81]' : 'bg-[#0F4C81]/20'}`}
                        />
                        <span className="text-[8px] text-[#082032]/30">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][hi]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top sellers */}
                <div>
                  <p className="text-xs font-semibold text-[#082032]/60 mb-3">Top Sellers</p>
                  <div className="space-y-2">
                    {[
                      { name: 'Amul Butter 500g', sold: 28, pct: 85 },
                      { name: 'Parle-G Biscuits', sold: 22, pct: 67 },
                      { name: 'Tata Tea Premium', sold: 18, pct: 55 },
                    ].map((item, ii) => (
                      <div key={ii} className="flex items-center gap-3">
                        <span className="text-xs text-[#082032]/60 w-28 truncate">{item.name}</span>
                        <div className="flex-1 h-2 bg-[#F5F9FC] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 + ii * 0.1 }}
                            className="h-full bg-[#0F4C81]/60 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#082032]/50 w-6 text-right">{item.sold}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Speed Comparison — How fast vs old way
// ────────────────────────────────────────

function SpeedComparison() {
  const tasks = [
    { task: 'Add a new product', oldWay: '2-5 min', arali: '8 sec', savings: '94%' },
    { task: 'Check all expiring items', oldWay: '30-60 min', arali: '3 sec', savings: '99%' },
    { task: 'Calculate daily profit', oldWay: '15-20 min', arali: 'Instant', savings: '100%' },
    { task: 'Search for a product', oldWay: '3-5 min', arali: '1 sec', savings: '99%' },
    { task: 'Create weekly report', oldWay: '1-2 hrs', arali: 'Automatic', savings: '100%' },
    { task: 'Check low stock items', oldWay: '20-30 min', arali: '2 sec', savings: '99%' },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0F4C81] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wider uppercase mb-6">
            Speed matters
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            See how much time you save.
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Every minute saved is a minute back with your customers, your family, or just breathing easy.
          </p>
        </motion.div>

        {/* Table */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
              <span className="col-span-1">Task</span>
              <span className="text-center">Old way</span>
              <span className="text-center">With Arali</span>
              <span className="text-center">Time saved</span>
            </div>

            {/* Rows */}
            {tasks.map((t, ti) => (
              <motion.div
                key={ti}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: ti * 0.06 }}
                className={`grid grid-cols-4 gap-4 px-6 py-4 items-center ${ti < tasks.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <span className="text-sm font-medium text-white/80">{t.task}</span>
                <span className="text-center text-sm text-white/30 line-through">{t.oldWay}</span>
                <span className="text-center text-sm font-bold text-white">{t.arali}</span>
                <div className="flex justify-center">
                  <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">{t.savings}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// A Day in the Life — Timeline
// ────────────────────────────────────────

function DayInLife() {
  const timeline = [
    { time: '7:00 AM', icon: Sun, title: 'Open your shop', desc: 'Arali shows overnight alerts: 2 items expiring today, 1 low stock. You know exactly what needs attention.', color: 'bg-amber-50 text-amber-500' },
    { time: '9:30 AM', icon: ShoppingCart, title: 'Morning rush', desc: 'A customer asks for Amul Butter. Quick search: 12 in stock, shelf B. Served in 5 seconds.', color: 'bg-blue-50 text-blue-500' },
    { time: '11:00 AM', icon: Bell, title: 'Get an alert', desc: 'Arali nudges you: "5 units of curd expire tomorrow." You tap "Create offer" and share on WhatsApp.', color: 'bg-red-50 text-red-500' },
    { time: '1:00 PM', icon: Plus, title: 'Restock arrives', desc: 'New stock delivery. Scan barcodes, quantities auto-fill. 30 items logged in 4 minutes.', color: 'bg-green-50 text-green-500' },
    { time: '4:00 PM', icon: Sparkles, title: 'AI suggestion', desc: '"Parle-G sells 22/week. You have 24 left. Reorder by Wednesday." You add it to your order list.', color: 'bg-violet-50 text-violet-500' },
    { time: '9:00 PM', icon: Moon, title: 'Close with clarity', desc: 'Check today\'s numbers: &#8377;4,200 revenue, &#8377;680 profit, 0 items wasted. Sleep peacefully.', color: 'bg-indigo-50 text-indigo-500' },
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            A day with Arali
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            What your day looks like.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            From morning to night, Arali quietly works beside you — like a smart assistant that never takes a break.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#0F4C81]/10 via-[#0F4C81]/20 to-[#0F4C81]/10" />

          <div className="space-y-8">
            {timeline.map((event, ei) => (
              <motion.div
                key={ei}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ei * 0.08 }}
                className="flex gap-5 md:gap-7 relative"
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${event.color} flex items-center justify-center shadow-sm`}>
                    <event.icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <span className="text-xs font-bold text-[#0F4C81]/40 uppercase tracking-wider">{event.time}</span>
                  <h3 className="text-lg font-bold text-[#082032] mt-1 mb-2">{event.title}</h3>
                  <p className="text-sm text-[#082032]/50 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.desc }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Works Everywhere — Device showcase
// ────────────────────────────────────────

function WorksEverywhere() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            Zero setup
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Works on whatever you have.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            No downloads. No installations. No special hardware. Just open your browser and start.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            { icon: Smartphone, title: 'Any smartphone', desc: 'Works on any phone with a browser. Android, iPhone — all good.', highlight: true },
            { icon: Wifi, title: 'Online mode', desc: 'Full features with internet. Real-time sync across devices.' },
            { icon: WifiOff, title: 'Offline mode', desc: 'Bad connection? No problem. Arali works offline and syncs later.' },
            { icon: Shield, title: 'Secure & private', desc: 'Bank-level encryption. Your data never leaves your control.' },
          ].map((card, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.08 }}
              className={`rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${card.highlight
                ? 'bg-[#0F4C81] text-white border-[#0F4C81] hover:shadow-[#0F4C81]/20'
                : 'bg-white text-[#082032] border-[#0F4C81]/5 hover:shadow-[#0F4C81]/10'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${card.highlight ? 'bg-white/15' : 'bg-[#0F4C81]/10'}`}>
                <card.icon size={22} className={card.highlight ? 'text-white' : 'text-[#0F4C81]'} />
              </div>
              <h3 className={`text-base font-bold mb-2 ${card.highlight ? 'text-white' : 'text-[#082032]'}`}>{card.title}</h3>
              <p className={`text-sm leading-relaxed ${card.highlight ? 'text-white/70' : 'text-[#082032]/50'}`}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Quick FAQ
// ────────────────────────────────────────

function QuickFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: 'How long does it take to set up Arali?', a: 'Most shop owners are up and running in under 5 minutes. You can start adding products immediately — no complex setup or configuration required.' },
    { q: 'Do I need to add all my products on day one?', a: 'Not at all. Start with the products you sell most. Add more whenever you want. Arali adapts to your pace — there is no rush.' },
    { q: 'What if I have 2,000+ products?', a: 'Arali handles up to 5,000 products on the free plan. For larger inventories, our Pro plan supports unlimited products. You can also import products via CSV.' },
    { q: 'Does it work without internet?', a: 'Yes. Arali works offline and syncs when your connection is back. You can add products, check inventory, and make sales even without internet.' },
    { q: 'Can my staff use it too?', a: 'Yes. With our Team plan, you can add staff accounts with different permission levels. They can manage inventory while you track everything from your phone.' },
    { q: 'Is my data safe?', a: 'Absolutely. We use bank-level encryption and your data is stored securely in the cloud. We never sell or share your business information with anyone.' },
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Quick answers.
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, fi) => (
            <motion.div
              key={fi}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: fi * 0.05 }}
              className="border border-[#0F4C81]/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === fi ? null : fi)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F5F9FC]/50 transition-colors"
              >
                <span className="text-sm font-semibold text-[#082032] pr-4">{faq.q}</span>
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#0F4C81]/5 flex items-center justify-center text-[#0F4C81]">
                  {open === fi ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              {open === fi && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#082032]/55 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Final CTA
// ────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#F5F9FC] to-white relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center mx-auto mb-8 text-[#0F4C81]">
            <Zap size={28} className="fill-[#0F4C81]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Ready to try? It takes 5 minutes.
          </h2>
          <p className="text-xl text-[#082032]/50 mb-10 leading-relaxed">
            No credit card. No complicated setup. Just open Arali, add your first product, and feel the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="h-14 px-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg rounded-full shadow-xl shadow-[#0F4C81]/10 transition-transform hover:scale-[1.02]">
                Start for free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="ghost" className="h-14 px-10 text-[#0F4C81] hover:bg-[#0F4C81]/5 text-lg rounded-full">
                Explore all features
              </Button>
            </Link>
          </div>
          <p className="text-sm text-[#082032]/30 mt-6">
            No credit card required &middot; Free forever plan &middot; 5 minute setup
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Main Page
// ────────────────────────────────────────

export function HowItWorks() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Step1 />
      <Step2 />
      <Step3 />
      <Step4 />
      <SpeedComparison />
      <DayInLife />
      <WorksEverywhere />
      <QuickFAQ />
      <FinalCTA />
    </div>
  );
}
