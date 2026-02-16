import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Check, X, ArrowRight, Zap, Shield, Star, Users,
  ChevronDown, ChevronUp, Package, TrendingUp,
  Heart, Crown, Building2, Sparkles, Gift,
  PiggyBank, Clock, Calculator, HelpCircle,
  CircleCheck, CircleMinus, Infinity as InfinityIcon,
  BadgeCheck, MessageCircle, FileText, Bell,
  BarChart3, Smartphone, Globe, Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { PLAN_DETAILS, PricingPlan } from '../constants/pricing';

// ────────────────────────────────────────
// Hero
// ────────────────────────────────────────

function Hero({ isYearly, setIsYearly }: { isYearly: boolean; setIsYearly: (v: boolean) => void }) {
  return (
    <section className="relative pt-8 pb-16 bg-gradient-to-b from-[#F5F9FC] to-white overflow-hidden">
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
            <Gift size={14} className="text-[#0F4C81]" />
            Start free, grow when ready
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#0F4C81] leading-[0.95] mb-8"
          >
            Pricing that<br />
            <span className="text-[#0F4C81]/40">makes sense.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#082032]/50 font-light leading-relaxed max-w-2xl mx-auto mb-10"
          >
            No hidden fees. No surprise charges. A free plan that actually works. Upgrade only when your shop outgrows it.
          </motion.p>

          {/* Monthly / Yearly Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-[#0F4C81]' : 'text-[#082032]/40'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? 'bg-[#0F4C81]' : 'bg-[#082032]/20'}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isYearly ? 'translate-x-7.5' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-[#0F4C81]' : 'text-[#082032]/40'}`}>
              Yearly
            </span>
            {isYearly && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold"
              >
                Save 20%
              </motion.span>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-[#082032]/30 text-xs"
          >
            <span className="flex items-center gap-1.5"><Shield size={12} /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Clock size={12} /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Lock size={12} /> Secure payments</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Pricing Cards — 3 main plans
// ────────────────────────────────────────

function PricingCards({ isYearly }: { isYearly: boolean }) {
  const yearlyDiscount = 0.8; // 20% off

  const plans = [
    {
      key: PricingPlan.FREE,
      icon: Gift,
      title: 'Free',
      subtitle: 'For shops just getting started',
      monthlyPrice: 0,
      features: [
        { text: '1 Store', included: true },
        { text: '100 Products (SKUs)', included: true },
        { text: '7 Days History', included: true },
        { text: 'Basic Inventory Tracking', included: true },
        { text: 'Mobile App Access', included: true },
        { text: 'Reports', included: false },
        { text: 'Smart Alerts', included: false },
        { text: 'Forecasting', included: false },
      ],
      cta: 'Start for free',
      popular: false,
      color: 'border-[#0F4C81]/10',
      btnClass: 'bg-[#F5F9FC] text-[#0F4C81] hover:bg-[#0F4C81]/10',
    },
    {
      key: PricingPlan.GROWTH,
      icon: Zap,
      title: 'Growth',
      subtitle: 'For serious retailers ready to scale',
      monthlyPrice: 1499,
      features: [
        { text: '5 Stores', included: true },
        { text: '2,000 Products (SKUs)', included: true },
        { text: '1 Year History', included: true },
        { text: 'Smart Alerts', included: true },
        { text: 'Export CSV/Excel', included: true },
        { text: 'Automated Reordering', included: true },
        { text: '30-Day Forecasting', included: true },
        { text: 'Role Management', included: true },
      ],
      cta: 'Start 14-day free trial',
      popular: true,
      color: 'border-[#0F4C81] ring-4 ring-[#0F4C81]/10',
      btnClass: 'bg-[#0F4C81] text-white hover:bg-[#0F4C81]/90 shadow-xl shadow-[#0F4C81]/15',
    },
    {
      key: PricingPlan.PRO,
      icon: Crown,
      title: 'Pro',
      subtitle: 'Complete control for scaling businesses',
      monthlyPrice: 3999,
      features: [
        { text: 'Unlimited Stores', included: true },
        { text: 'Unlimited Products', included: true },
        { text: 'Unlimited History', included: true },
        { text: 'WhatsApp Alerts', included: true },
        { text: 'API Access', included: true },
        { text: 'Audit Logs', included: true },
        { text: '90-Day Forecasting', included: true },
        { text: 'Priority Support', included: true },
      ],
      cta: 'Start 14-day free trial',
      popular: false,
      color: 'border-[#0F4C81]/10',
      btnClass: 'bg-[#F5F9FC] text-[#0F4C81] hover:bg-[#0F4C81]/10',
    },
  ];

  return (
    <section className="py-4 pb-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Main 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {plans.map((plan, pi) => {
            const price = plan.monthlyPrice === 0
              ? 0
              : isYearly
                ? Math.round(plan.monthlyPrice * yearlyDiscount)
                : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: pi * 0.1 }}
                className={`relative flex flex-col bg-white rounded-3xl border-2 ${plan.color} overflow-hidden ${plan.popular ? 'md:-mt-4 md:mb-[-16px] shadow-2xl shadow-[#0F4C81]/10' : 'shadow-lg shadow-[#0F4C81]/5'}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="bg-[#0F4C81] text-white text-center py-2.5 text-xs font-bold uppercase tracking-widest">
                    <Star size={12} className="inline-block mr-1.5 fill-white" />
                    Most Popular
                  </div>
                )}

                <div className="p-7 flex-1 flex flex-col">
                  {/* Plan icon & title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-[#0F4C81]/10 text-[#0F4C81]' : 'bg-[#F5F9FC] text-[#0F4C81]/60'}`}>
                      <plan.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#082032]">{plan.title}</h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    <div className="flex items-baseline gap-1">
                      {price === 0 ? (
                        <span className="text-4xl font-bold text-[#082032]">Free</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-[#082032]">&#8377;{price.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-[#082032]/40">/mo</span>
                        </>
                      )}
                    </div>
                    {isYearly && price > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        &#8377;{(price * 12).toLocaleString('en-IN')}/year &middot; Save &#8377;{((plan.monthlyPrice * 12) - (price * 12)).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-[#082032]/45 mb-6">{plan.subtitle}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        {f.included ? (
                          <CircleCheck size={16} className="text-[#0F4C81] shrink-0 mt-0.5" />
                        ) : (
                          <CircleMinus size={16} className="text-[#082032]/15 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${f.included ? 'text-[#082032]/70' : 'text-[#082032]/25'}`}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to="/get-started">
                    <Button className={`w-full h-12 rounded-xl font-semibold ${plan.btnClass}`}>
                      {plan.cta}
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary plans strip */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#F5F9FC] rounded-2xl p-6 border border-[#0F4C81]/5 flex items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Package size={16} className="text-[#0F4C81]/50" />
                  <h4 className="font-bold text-[#082032]">Starter — &#8377;{isYearly ? Math.round(499 * yearlyDiscount).toLocaleString('en-IN') : '499'}/mo</h4>
                </div>
                <p className="text-xs text-[#082032]/40">500 SKUs, 90-day history, basic reports, basic forecasting. For growing shops.</p>
              </div>
              <Link to="/get-started">
                <Button variant="ghost" className="text-[#0F4C81] text-sm shrink-0">
                  Get started <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#F5F9FC] rounded-2xl p-6 border border-[#0F4C81]/5 flex items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={16} className="text-[#0F4C81]/50" />
                  <h4 className="font-bold text-[#082032]">Enterprise — Custom pricing</h4>
                </div>
                <p className="text-xs text-[#082032]/40">Unlimited everything, dedicated support, custom integrations, SLA guarantees.</p>
              </div>
              <Link to="/get-started">
                <Button variant="ghost" className="text-[#0F4C81] text-sm shrink-0">
                  Contact sales <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// ROI Section — "Arali pays for itself"
// ────────────────────────────────────────

function ROISection() {
  const scenarios = [
    {
      plan: 'Free',
      cost: '&#8377;0/mo',
      wasteSaved: '&#8377;3,000',
      timeSaved: '2 hrs/week',
      roi: 'Infinite',
      roiColor: 'text-green-600',
    },
    {
      plan: 'Growth',
      cost: '&#8377;1,499/mo',
      wasteSaved: '&#8377;7,600',
      timeSaved: '4 hrs/week',
      roi: '5x return',
      roiColor: 'text-green-600',
    },
    {
      plan: 'Pro',
      cost: '&#8377;3,999/mo',
      wasteSaved: '&#8377;12,000+',
      timeSaved: '6 hrs/week',
      roi: '3x return',
      roiColor: 'text-green-600',
    },
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
            <PiggyBank size={12} className="inline mr-1.5" />
            ROI Calculator
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Arali pays for itself.
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Even the Free plan saves you money. Every paid plan returns 3-5x its cost in prevented waste and saved time.
          </p>
        </motion.div>

        {/* ROI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
          {scenarios.map((s, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: si * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors duration-300"
            >
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">{s.plan} Plan</p>
              <p className="text-sm text-white/30 mb-1">You pay</p>
              <p className="text-xl font-bold text-white mb-4" dangerouslySetInnerHTML={{ __html: s.cost }} />

              <div className="h-px bg-white/10 mb-4" />

              <p className="text-sm text-white/30 mb-1">Average waste saved</p>
              <p className="text-xl font-bold text-green-400 mb-2" dangerouslySetInnerHTML={{ __html: s.wasteSaved + '/mo' }} />

              <p className="text-sm text-white/30 mb-1">Time saved</p>
              <p className="text-base font-semibold text-white/70 mb-4">{s.timeSaved}</p>

              <div className="py-2.5 rounded-xl bg-green-500/15 border border-green-500/20">
                <p className="text-xs text-green-300 uppercase tracking-wider font-bold">Return</p>
                <p className={`text-2xl font-bold text-green-400`}>{s.roi}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-white/40 leading-relaxed">
            Based on average data from 2,500+ shops. Your savings depend on shop size, product types, and current waste levels. Most shops see positive ROI within the first week.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Full Feature Comparison Table
// ────────────────────────────────────────

function FeatureTable() {
  const [expanded, setExpanded] = useState(false);

  const categories = [
    {
      category: 'Inventory',
      features: [
        { name: 'Product tracking', free: true, starter: true, growth: true, pro: true },
        { name: 'Max products (SKUs)', free: '100', starter: '500', growth: '2,000', pro: 'Unlimited' },
        { name: 'Barcode scanning', free: true, starter: true, growth: true, pro: true },
        { name: 'Expiry date tracking', free: true, starter: true, growth: true, pro: true },
        { name: 'Multi-store support', free: '1', starter: '1', growth: '5', pro: 'Unlimited' },
        { name: 'Batch management', free: false, starter: false, growth: true, pro: true },
      ],
    },
    {
      category: 'Alerts & Notifications',
      features: [
        { name: 'In-app alerts', free: true, starter: true, growth: true, pro: true },
        { name: 'Email alerts', free: false, starter: true, growth: true, pro: true },
        { name: 'Smart alerts (AI)', free: false, starter: false, growth: true, pro: true },
        { name: 'WhatsApp alerts', free: false, starter: false, growth: false, pro: true },
      ],
    },
    {
      category: 'Reports & Analytics',
      features: [
        { name: 'Data history', free: '7 days', starter: '90 days', growth: '1 year', pro: 'Unlimited' },
        { name: 'Basic reports', free: false, starter: true, growth: true, pro: true },
        { name: 'Advanced analytics', free: false, starter: false, growth: true, pro: true },
        { name: 'Export (CSV/Excel)', free: false, starter: false, growth: true, pro: true },
        { name: 'Custom dashboards', free: false, starter: false, growth: false, pro: true },
      ],
    },
    {
      category: 'AI & Automation',
      features: [
        { name: 'Demand forecasting', free: false, starter: '7 days', growth: '30 days', pro: '90 days' },
        { name: 'Auto reorder suggestions', free: false, starter: false, growth: true, pro: true },
        { name: 'AI insights', free: false, starter: false, growth: true, pro: true },
      ],
    },
    {
      category: 'Team & Security',
      features: [
        { name: 'Role management', free: false, starter: false, growth: true, pro: true },
        { name: 'Audit logs', free: false, starter: false, growth: false, pro: true },
        { name: 'API access', free: false, starter: false, growth: false, pro: true },
        { name: 'Priority support', free: false, starter: false, growth: false, pro: true },
      ],
    },
  ];

  const visibleCategories = expanded ? categories : categories.slice(0, 3);

  function renderCell(value: boolean | string) {
    if (typeof value === 'boolean') {
      return value
        ? <CircleCheck size={16} className="text-[#0F4C81] mx-auto" />
        : <X size={14} className="text-[#082032]/15 mx-auto" />;
    }
    return <span className="text-xs font-semibold text-[#0F4C81]">{value}</span>;
  }

  return (
    <section className="py-24 md:py-32 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            Full comparison
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Compare every feature.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            See exactly what you get at each level. No surprises.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-[#0F4C81]/5 border border-[#0F4C81]/10 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 gap-0 border-b border-[#0F4C81]/10 bg-[#F5F9FC]">
              <div className="p-5 col-span-1">
                <span className="text-xs font-bold text-[#082032]/40 uppercase tracking-wider">Feature</span>
              </div>
              {['Free', 'Starter', 'Growth', 'Pro'].map((name, ni) => (
                <div key={ni} className={`p-5 text-center ${ni === 2 ? 'bg-[#0F4C81]/5' : ''}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${ni === 2 ? 'text-[#0F4C81]' : 'text-[#082032]/50'}`}>
                    {name}
                  </span>
                </div>
              ))}
            </div>

            {/* Categories */}
            {visibleCategories.map((cat, ci) => (
              <div key={ci}>
                {/* Category header */}
                <div className="px-5 py-3 bg-[#F5F9FC]/50 border-b border-[#0F4C81]/5">
                  <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">{cat.category}</span>
                </div>
                {/* Features */}
                {cat.features.map((feature, fi) => (
                  <div key={fi} className="grid grid-cols-5 gap-0 border-b border-[#0F4C81]/5 last:border-b-0">
                    <div className="p-4 col-span-1 flex items-center">
                      <span className="text-sm text-[#082032]/60">{feature.name}</span>
                    </div>
                    <div className="p-4 flex items-center justify-center">{renderCell(feature.free)}</div>
                    <div className="p-4 flex items-center justify-center">{renderCell(feature.starter)}</div>
                    <div className="p-4 flex items-center justify-center bg-[#0F4C81]/[0.02]">{renderCell(feature.growth)}</div>
                    <div className="p-4 flex items-center justify-center">{renderCell(feature.pro)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Expand/Collapse */}
          {!expanded && (
            <div className="text-center mt-6">
              <button
                onClick={() => setExpanded(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#0F4C81]/10 text-sm font-medium text-[#0F4C81] hover:bg-[#0F4C81]/5 transition-colors"
              >
                Show all features
                <ChevronDown size={16} />
              </button>
            </div>
          )}
          {expanded && (
            <div className="text-center mt-6">
              <button
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#0F4C81]/10 text-sm font-medium text-[#0F4C81] hover:bg-[#0F4C81]/5 transition-colors"
              >
                Show less
                <ChevronUp size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Social Proof Strip
// ────────────────────────────────────────

function SocialProof() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '2,500+', label: 'Active shops', icon: Users },
            { value: '4.9/5', label: 'Average rating', icon: Star },
            { value: '94%', label: 'Recommend to others', icon: Heart },
            { value: '<5 min', label: 'Setup time', icon: Zap },
          ].map((stat, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: si * 0.08 }}
              className="text-center p-6 rounded-2xl bg-[#F5F9FC] border border-[#0F4C81]/5"
            >
              <stat.icon size={20} className="text-[#0F4C81]/40 mx-auto mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-1">{stat.value}</p>
              <p className="text-xs text-[#082032]/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mt-14 text-center"
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-lg text-[#082032]/60 leading-relaxed mb-5 italic">
            &ldquo;I was paying &#8377;2,500/month for a billing app I barely used. Switched to Arali Growth at &#8377;1,499 and it does 10x more for my shop. The expiry alerts alone saved me &#8377;8,000 last month.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
              <span className="text-sm font-bold text-[#0F4C81]">RK</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#082032]">Rajesh K.</p>
              <p className="text-xs text-[#082032]/40">Kirana Store, Hyderabad</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Guarantee Section
// ────────────────────────────────────────

function Guarantee() {
  return (
    <section className="py-20 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#0F4C81]/10 shadow-lg shadow-[#0F4C81]/5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
              <Shield size={28} className="text-green-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#0F4C81] mb-4">
              Our risk-free promise
            </h3>
            <p className="text-[#082032]/55 leading-relaxed mb-8 max-w-lg mx-auto">
              Try any paid plan free for 14 days. If you are not completely satisfied, cancel with one click — no questions asked, no charges applied. We will even help you export your data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#082032]/50">
              {[
                { icon: Shield, text: '14-day free trial' },
                { icon: X, text: 'No credit card needed' },
                { icon: BadgeCheck, text: 'Cancel anytime' },
                { icon: FileText, text: 'Export your data' },
              ].map((g, gi) => (
                <div key={gi} className="flex items-center gap-2">
                  <g.icon size={14} className="text-green-500" />
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Pricing FAQ
// ────────────────────────────────────────

function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can I really use Arali for free?',
      a: 'Absolutely. The Free plan is not a trial — it is a full plan with no time limit. You get 100 products, basic inventory tracking, and mobile access. Upgrade only when you need more.',
    },
    {
      q: 'What happens when I hit the product limit?',
      a: 'Arali will let you know when you are approaching your limit. You can upgrade anytime with one click. Your existing data stays exactly as it is — nothing is lost or changed.',
    },
    {
      q: 'Can I switch plans anytime?',
      a: 'Yes. You can upgrade or downgrade at any time. If you upgrade mid-cycle, you only pay the prorated difference. If you downgrade, you keep your features until the current billing period ends.',
    },
    {
      q: 'Do you offer discounts for NGOs or government shops?',
      a: 'Yes. We offer special pricing for registered NGOs, government fair-price shops, and cooperative societies. Contact us at support@arali.app for details.',
    },
    {
      q: 'Is my payment information secure?',
      a: 'We use Razorpay for all payments, which is PCI-DSS Level 1 compliant. We never store your card details on our servers. You can also pay via UPI.',
    },
    {
      q: 'What if I want to cancel?',
      a: 'Cancel anytime from your dashboard — one click, no calls, no emails needed. You keep access until the end of your billing period. We can also export all your data for you.',
    },
    {
      q: 'Is there a contract or lock-in?',
      a: 'No contracts, ever. Monthly plans are month-to-month. Yearly plans can be cancelled anytime with a prorated refund for unused months.',
    },
    {
      q: 'Do you support UPI and Indian payment methods?',
      a: 'Yes. We support UPI, debit cards, credit cards, net banking, and wallets like Paytm and PhonePe through Razorpay.',
    },
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
            <HelpCircle size={12} className="inline mr-1.5" />
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Pricing questions? Answered.
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, fi) => (
            <motion.div
              key={fi}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: fi * 0.04 }}
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
            <Sparkles size={28} className="fill-[#0F4C81]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Start free. Grow when ready.
          </h2>
          <p className="text-xl text-[#082032]/50 mb-10 leading-relaxed">
            Join 2,500+ shop owners who stopped losing money to waste and started running their shops with confidence.
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
                Explore features
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

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="flex flex-col">
      <Hero isYearly={isYearly} setIsYearly={setIsYearly} />
      <PricingCards isYearly={isYearly} />
      <ROISection />
      <FeatureTable />
      <SocialProof />
      <Guarantee />
      <PricingFAQ />
      <FinalCTA />
    </div>
  );
}
