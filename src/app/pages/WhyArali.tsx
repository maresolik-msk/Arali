import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import {
  Check, X, Heart, Shield, Zap, Eye, Users, Clock,
  ArrowRight, TrendingUp, TrendingDown, AlertTriangle,
  Smartphone, Globe, Lightbulb, Package, Star, Quote,
  Sparkles, Target, FileText, Layers, PiggyBank,
  Frown, Smile, ChevronRight, ArrowUpRight, Coffee
} from 'lucide-react';

const imgShopStressed = "https://images.unsplash.com/photo-1730725738218-854487d9f73a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHNob3AlMjBvd25lciUyMHdvcnJpZWQlMjBzdHJlc3NlZCUyMGNvdW50ZXJ8ZW58MXx8fHwxNzcwOTE1NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgFamilyShop = "https://images.unsplash.com/photo-1720553359883-43e221149b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBzaG9wJTIwdHJhZGl0aW9uYWwlMjBtYXJrZXQlMjB3YXJtJTIwbGlnaHR8ZW58MXx8fHwxNzcwOTE1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgOrganized = "https://images.unsplash.com/photo-1769988037978-ddd3d54332c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wJTIwc2hlbHZlcyUyMG9yZ2FuaXplZCUyMHByb2R1Y3RzfGVufDF8fHx8MTc3MDkxNTU2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgHappyOwner = "https://images.unsplash.com/photo-1767327142313-4a5f0f13ec9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMG1lcmNoYW50JTIwY29uZmlkZW50JTIwc2hvcCUyMG93bmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwOTE1NTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgSunrise = "https://images.unsplash.com/photo-1764002932319-85550b761715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwbW9ybmluZyUyMHBlYWNlZnVsJTIwY2FsbSUyMG5hdHVyZXxlbnwxfHx8fDE3NzA5MTU1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// ────────────────────────────────────────
// Hero Section
// ────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-[#F5F9FC] to-white overflow-hidden pt-8 pb-20">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[700px] h-[700px] bg-[#0F4C81]/3 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0F4C81]/3 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #0F4C81 1px, transparent 1px)',
          backgroundSize: '40px 40px'
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
            <Heart size={14} className="fill-[#0F4C81]" />
            Why Arali
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#0F4C81] leading-[0.95] mb-8"
          >
            Built for the shopkeeper<br />
            <span className="text-[#0F4C81]/40">nobody built for.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#082032]/50 font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            Enterprise tools weren't made for you. Paper notebooks can't keep up with you. Arali was born from watching real shop owners struggle — and deciding to fix it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login">
              <Button className="h-14 px-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg rounded-full shadow-xl shadow-[#0F4C81]/10 transition-transform hover:scale-[1.02]">
                Start for free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/story">
              <Button variant="ghost" className="h-14 px-10 text-[#0F4C81] hover:bg-[#0F4C81]/5 text-lg rounded-full">
                Read our story
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// The Real Problem — Emotional storytelling
// ────────────────────────────────────────

function RealProblem() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#0F4C81]/10 relative">
              <img
                src={imgShopStressed}
                alt="Shop owner managing daily challenges"
                className="w-full h-auto object-cover aspect-[4/5] md:aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/40 to-transparent" />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 p-5 max-w-[200px]"
            >
              <div className="text-3xl font-bold text-red-500 mb-1">₹12,000</div>
              <p className="text-xs text-[#082032]/50">Average monthly loss from expired stock in small Indian shops</p>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-red-50 text-red-500 text-xs font-semibold tracking-wider uppercase mb-6">
              The problem
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              Every day, small shops lose money they can't see.
            </h2>
            <div className="space-y-5 mb-8">
              <p className="text-lg text-[#082032]/60 leading-relaxed">
                A dairy product expires on Tuesday. Nobody notices until Friday. That's ₹200 gone. Multiply that across dozens of items, every week, every month.
              </p>
              <p className="text-lg text-[#082032]/60 leading-relaxed">
                Meanwhile, a customer walks in asking for something you have — on the back shelf, behind three other boxes. But you say <span className="italic text-[#082032]/80">"Sorry, out of stock."</span>
              </p>
              <p className="text-lg text-[#082032]/60 leading-relaxed">
                At night, you lie in bed wondering: <span className="italic text-[#082032]/80">"Did I make a profit today? Or am I slowly losing?"</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: TrendingDown, label: '₹12K/mo wasted', color: 'text-red-500 bg-red-50' },
                { icon: Clock, label: '4 hrs/week lost', color: 'text-amber-500 bg-amber-50' },
                { icon: Frown, label: 'Constant anxiety', color: 'text-gray-500 bg-gray-100' },
              ].map((tag, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${tag.color}`}>
                  <tag.icon size={14} />
                  {tag.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Our Philosophy — Values grid
// ────────────────────────────────────────

function Philosophy() {
  const values = [
    {
      icon: Heart,
      title: 'Built with empathy',
      desc: 'We spent months sitting inside real shops, watching real problems. Every feature exists because a shopkeeper needed it.',
      color: 'from-rose-500/10 to-rose-500/5',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
    {
      icon: Zap,
      title: 'Simplicity is sacred',
      desc: 'If your uncle who has never used a smartphone app can\'t figure it out in 5 minutes, we redesign it. Period.',
      color: 'from-amber-500/10 to-amber-500/5',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      icon: Globe,
      title: 'Made for India',
      desc: 'Supports Hindi, Telugu, Kannada. Works offline in areas with bad connectivity. Prices in rupees. UPI payments built-in.',
      color: 'from-[#0F4C81]/10 to-[#0F4C81]/5',
      iconBg: 'bg-[#0F4C81]/10',
      iconColor: 'text-[#0F4C81]',
    },
    {
      icon: Shield,
      title: 'Your data, your control',
      desc: 'We will never sell your data. We will never show you ads. Your business information stays yours. Always.',
      color: 'from-green-500/10 to-green-500/5',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: PiggyBank,
      title: 'Fair pricing, forever',
      desc: 'We charge what\'s fair. A free tier that actually works. No hidden fees. No surprise price hikes after you\'re locked in.',
      color: 'from-violet-500/10 to-violet-500/5',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
    },
    {
      icon: Users,
      title: 'Support that cares',
      desc: 'Real humans answer your questions in your language. Not chatbots. Not ticket numbers. People who understand your world.',
      color: 'from-sky-500/10 to-sky-500/5',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500',
    },
  ];

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
            Our philosophy
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            What we believe in.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            Arali isn't just software — it's a set of beliefs about how technology should serve the people who work hardest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group bg-gradient-to-br ${v.color} rounded-3xl p-8 border border-white/60 hover:shadow-xl hover:shadow-[#0F4C81]/5 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-13 h-13 rounded-2xl ${v.iconBg} flex items-center justify-center mb-6 ${v.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <v.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#082032] mb-3">{v.title}</h3>
              <p className="text-sm text-[#082032]/55 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// The Arali Way — Visual journey
// ────────────────────────────────────────

function AraliWay() {
  const shifts = [
    {
      before: { label: 'Complexity', icon: Layers, desc: 'Enterprise tools with 200 features you\'ll never touch' },
      after: { label: 'Simplicity', icon: Sparkles, desc: 'Only what you need, designed to be learned in minutes' },
    },
    {
      before: { label: 'Anxiety', icon: Frown, desc: 'Lying awake wondering if the shop is profitable' },
      after: { label: 'Peace of mind', icon: Smile, desc: 'Check your numbers in 30 seconds before bed' },
    },
    {
      before: { label: 'Waste', icon: TrendingDown, desc: 'Throwing expired items in the bin every week' },
      after: { label: 'Savings', icon: PiggyBank, desc: 'Alerts, discounts, and action before items expire' },
    },
    {
      before: { label: 'Guesswork', icon: Eye, desc: '"I think we have that... let me check the back"' },
      after: { label: 'Clarity', icon: Target, desc: 'Instant search: exact stock, location, and price' },
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#0F4C81]/3 rounded-full blur-[120px]" />
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
            The shift
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            From surviving to thriving.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            Arali doesn't just add features to your day. It replaces the old way with something better.
          </p>
        </motion.div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {shifts.map((shift, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#F5F9FC] rounded-2xl md:rounded-3xl border border-[#0F4C81]/5 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Before */}
                <div className="flex-1 p-6 md:p-8 flex items-center gap-4 md:gap-5 border-b md:border-b-0 md:border-r border-[#0F4C81]/5 bg-white/50">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0 text-red-400">
                    <shift.before.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Before</span>
                      <span className="text-sm font-bold text-[#082032]/70">{shift.before.label}</span>
                    </div>
                    <p className="text-xs text-[#082032]/40 leading-relaxed">{shift.before.desc}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center px-4 bg-[#F5F9FC] -mx-px relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#0F4C81] flex items-center justify-center shadow-lg shadow-[#0F4C81]/20">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex md:hidden items-center justify-center py-2 bg-[#F5F9FC]">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C81] flex items-center justify-center shadow-lg shadow-[#0F4C81]/20 rotate-90">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>

                {/* After */}
                <div className="flex-1 p-6 md:p-8 flex items-center gap-4 md:gap-5 bg-[#0F4C81]/[0.03]">
                  <div className="w-11 h-11 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0 text-[#0F4C81]">
                    <shift.after.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C81]">With Arali</span>
                      <span className="text-sm font-bold text-[#0F4C81]">{shift.after.label}</span>
                    </div>
                    <p className="text-xs text-[#082032]/50 leading-relaxed">{shift.after.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Enhanced Comparison Section
// ────────────────────────────────────────

function EnhancedComparisons() {
  const comparisons = [
    {
      title: 'Vs. Paper Notebooks',
      icon: FileText,
      image: imgFamilyShop,
      arali: [
        'Searchable, filterable product database',
        'Automatic expiry alerts & stock warnings',
        'History that never tears, fades, or gets lost',
        'Instant profit & loss calculations',
      ],
      others: [
        'Unreadable handwriting after a few weeks',
        'No reminders — you discover expired goods by accident',
        'Pages tear, books get wet, history vanishes',
        'Manual math prone to errors',
      ],
    },
    {
      title: 'Vs. Complex Billing Apps',
      icon: Layers,
      image: imgOrganized,
      arali: [
        'Learn everything in under 5 minutes',
        'Designed for one-person shops, not corporations',
        'Works offline on any ₹8,000 smartphone',
        'Free tier that\'s actually useful',
      ],
      others: [
        'Two-week training, still confusing menus',
        'Features for warehouses, supply chains, HR — irrelevant',
        'Needs powerful hardware and constant internet',
        '"Free trial" that becomes expensive fast',
      ],
    },
    {
      title: 'Vs. Doing Nothing',
      icon: Coffee,
      image: imgHappyOwner,
      arali: [
        'Save ₹7,000-12,000 per month on waste',
        'Sleep knowing exactly how your day went',
        'Grow your customer base with smart updates',
        'Make data-backed decisions, not guesses',
      ],
      others: [
        'Lose money silently, week after week',
        'Constant background anxiety about the shop',
        'Miss opportunities to attract new customers',
        'Rely on gut feeling that\'s often wrong',
      ],
    },
  ];

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
            Honest comparisons
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            See the difference yourself.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            We don't believe in hype. Here's exactly what you get — and what you leave behind.
          </p>
        </motion.div>

        <div className="space-y-8 max-w-6xl mx-auto">
          {comparisons.map((comp, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: ci * 0.1 }}
              className="bg-white rounded-3xl shadow-lg shadow-[#0F4C81]/5 border border-[#0F4C81]/5 overflow-hidden"
            >
              {/* Header with image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img src={comp.image} alt={comp.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/70 via-[#082032]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <comp.icon size={20} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{comp.title}</h3>
                  </div>
                </div>
              </div>

              {/* Comparison grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#0F4C81]/5">
                {/* With Arali */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-full bg-[#0F4C81] flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="font-bold text-[#0F4C81]">With Arali</span>
                  </div>
                  <ul className="space-y-3.5">
                    {comp.arali.map((point, pi) => (
                      <li key={pi} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} className="text-[#0F4C81]" />
                        </div>
                        <span className="text-sm text-[#082032]/70 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Without */}
                <div className="p-6 md:p-8 bg-gray-50/50">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                      <X size={14} className="text-gray-400" />
                    </div>
                    <span className="font-bold text-[#082032]/40">Without Arali</span>
                  </div>
                  <ul className="space-y-3.5">
                    {comp.others.map((point, pi) => (
                      <li key={pi} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <X size={10} className="text-gray-300" />
                        </div>
                        <span className="text-sm text-[#082032]/40 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Impact Numbers
// ────────────────────────────────────────

function ImpactNumbers() {
  const stats = [
    { value: '₹7,600', unit: '/mo', label: 'Average savings from reduced waste', icon: PiggyBank, color: 'text-green-500' },
    { value: '2', unit: ' hrs', label: 'Saved weekly from manual stock checking', icon: Clock, color: 'text-[#0F4C81]' },
    { value: '94', unit: '%', label: 'Of users say they feel less anxious', icon: Smile, color: 'text-amber-500' },
    { value: '5', unit: ' min', label: 'Average time to learn & start using Arali', icon: Zap, color: 'text-violet-500' },
    { value: '30', unit: '%', label: 'Average reduction in expired stock', icon: TrendingUp, color: 'text-green-500' },
    { value: '4.9', unit: '/5', label: 'Rating from 2,500+ shop owners', icon: Star, color: 'text-amber-400' },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0F4C81] text-white relative overflow-hidden">
      {/* Background */}
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wider uppercase mb-6">
            By the numbers
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Real impact. Real numbers.
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Measured across thousands of shops using Arali every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 text-center group hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={22} className="text-white/70" />
              </div>
              <div className="flex items-baseline justify-center gap-0.5 mb-3">
                <span className="text-4xl font-bold text-white">{stat.value}</span>
                <span className="text-lg font-medium text-white/40">{stat.unit}</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Testimonial (Deep, single story)
// ────────────────────────────────────────

function DeepTestimonial() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F4C81]/3 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F5F9FC] rounded-[2.5rem] p-8 md:p-14 relative border border-[#0F4C81]/5"
          >
            {/* Quote mark */}
            <div className="absolute top-8 right-8 md:top-12 md:right-14">
              <Quote size={60} className="text-[#0F4C81]/5" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-8">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl font-light text-[#082032]/70 leading-relaxed mb-10 max-w-3xl">
              "My father ran this shop for 30 years with a ledger book. When I took over, I tried three different apps — all designed for big businesses. One had 47 menu items. Forty-seven.
              <br /><br />
              Then I found Arali. I set it up during lunch break. By evening, I had my entire inventory digitized. That night, for the first time in months, I didn't lie awake doing mental math.
              <br /><br />
              Last month, Arali caught ₹8,200 worth of items about to expire. I ran a one-day sale on WhatsApp. Sold everything. <span className="text-[#0F4C81] font-medium">That's not a feature — that's my family's dinner money saved.</span>"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#0F4C81]/10 flex items-center justify-center">
                <span className="text-lg font-bold text-[#0F4C81]">VK</span>
              </div>
              <div>
                <p className="font-semibold text-[#082032]">Vikram Kumar</p>
                <p className="text-sm text-[#082032]/40">Grocery Store Owner · Anantapur, AP</p>
                <p className="text-xs text-[#0F4C81] font-medium mt-0.5">Using Arali for 8 months</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// The Promise
// ────────────────────────────────────────

function ThePromise() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
              Our promise
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              We promise to stay simple, honest, and useful.
            </h2>
            <div className="space-y-5 mb-8">
              {[
                { icon: Check, text: 'We will never bloat Arali with features you don\'t need' },
                { icon: Check, text: 'We will never raise prices on existing customers' },
                { icon: Check, text: 'We will never sell or share your business data' },
                { icon: Check, text: 'We will always have a free tier that actually works' },
                { icon: Check, text: 'We will always answer support in your language' },
                { icon: Check, text: 'We will always build what shopkeepers ask for first' },
              ].map((promise, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0F4C81] flex items-center justify-center shrink-0 mt-0.5">
                    <promise.icon size={12} className="text-white" />
                  </div>
                  <span className="text-[#082032]/70 leading-relaxed">{promise.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#0F4C81]/10 relative">
              <img
                src={imgSunrise}
                alt="New beginnings"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C81]/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Who Is It For
// ────────────────────────────────────────

function WhoIsItFor() {
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
            Perfect fit
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Arali is for you if...
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            {
              emoji: '🏪',
              title: 'You run a small shop',
              desc: 'Grocery, kirana, dairy, provision, cosmetics, bakery — any shop with 50-5,000 products.',
            },
            {
              emoji: '📦',
              title: 'You sell perishable goods',
              desc: 'If items expire on your shelves, Arali\'s expiry tracking will pay for itself in week one.',
            },
            {
              emoji: '📓',
              title: 'You still use notebooks',
              desc: 'Switching from paper to Arali feels natural — we designed it to be even simpler.',
            },
            {
              emoji: '😰',
              title: 'You worry about money',
              desc: 'Not knowing daily profit is stressful. Arali gives you clarity in under 30 seconds.',
            },
            {
              emoji: '📱',
              title: 'You have a basic smartphone',
              desc: 'Arali works on any phone with a browser. No downloads. No storage needed.',
            },
            {
              emoji: '🌍',
              title: 'You prefer your language',
              desc: 'Use Arali in Hindi, Telugu, Kannada, or English. Fully localized for Indian retailers.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-[#F5F9FC] rounded-2xl p-7 border border-[#0F4C81]/5 hover:border-[#0F4C81]/15 hover:shadow-lg hover:shadow-[#0F4C81]/5 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">{item.emoji}</div>
              <h3 className="text-base font-bold text-[#082032] mb-2">{item.title}</h3>
              <p className="text-sm text-[#082032]/50 leading-relaxed">{item.desc}</p>
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
            <Heart size={28} className="fill-[#0F4C81]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Your shop deserves better tools.
          </h2>
          <p className="text-xl text-[#082032]/50 mb-10 leading-relaxed">
            Start free today. No credit card. No setup time. Just open Arali and see the difference in your very first week.
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
            No credit card required · Free forever plan · 5 minute setup
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Main Page
// ────────────────────────────────────────

export function WhyArali() {
  return (
    <div className="flex flex-col">
      <Hero />
      <RealProblem />
      <Philosophy />
      <AraliWay />
      <EnhancedComparisons />
      <ImpactNumbers />
      <DeepTestimonial />
      <WhoIsItFor />
      <ThePromise />
      <FinalCTA />
    </div>
  );
}