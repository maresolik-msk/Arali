import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import {
  Search, HelpCircle, ChevronDown, ChevronUp,
  ArrowRight, Rocket, Shield, CreditCard, Smartphone,
  Zap, Users, Package, Globe, MessageCircle,
  Mail, Phone, BookOpen, Sparkles, BarChart3,
  Bell, Lock, Wifi, Download, RefreshCw,
  Star, Heart, Lightbulb, Clock
} from 'lucide-react';

// ────────────────────────────────────────
// FAQ Data
// ────────────────────────────────────────

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  faqs: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    description: 'Setup, onboarding, and your first steps',
    color: 'bg-blue-50 text-blue-500',
    faqs: [
      {
        q: 'How do I get started with Arali?',
        a: 'Download the app or visit arali.app, create a free account with your phone number or email, add your shop name, and start adding products. The whole process takes less than 5 minutes. No training or technical knowledge is required.'
      },
      {
        q: 'Do I need a computer to use Arali?',
        a: 'No. Arali is designed to work perfectly on your smartphone. It works on any Android or iOS device, even older models. You can also use it on a tablet or computer if you prefer, but a phone is all you need.'
      },
      {
        q: 'Can I try Arali before paying?',
        a: 'Absolutely. Our Free plan is not a trial with a time limit. It is a real plan that you can use forever with 100 products, basic inventory tracking, and mobile access. You only pay if you choose to upgrade for more features.'
      },
      {
        q: 'How long does it take to set up my shop?',
        a: 'Most shop owners are up and running in under 5 minutes. Adding your first 20-30 products takes another 10-15 minutes. After that, adding new products takes just a few seconds each using barcode scanning or manual entry.'
      },
      {
        q: 'Do I need to enter all my products at once?',
        a: 'Not at all. You can add products gradually as you receive stock or make sales. Many shop owners start with their top 20-30 fast-moving items and add the rest over a few days. Arali works great even with partial inventory.'
      },
      {
        q: 'Is there a tutorial or help guide?',
        a: 'Yes. When you first open the app, a quick walkthrough shows you the key features. We also have video tutorials in Hindi, Tamil, Telugu, and English on our YouTube channel. Our support team is available on WhatsApp for any questions.'
      },
    ],
  },
  {
    id: 'features',
    title: 'Features & Usage',
    icon: Sparkles,
    description: 'How things work inside Arali',
    color: 'bg-violet-50 text-violet-500',
    faqs: [
      {
        q: 'What does the expiry tracking feature do?',
        a: 'Arali automatically monitors the expiry dates of all your products. It sends you alerts when products are approaching their expiry date, giving you time to sell them first, offer discounts, or arrange returns with your vendor. Most shops save thousands of rupees every month with this feature alone.'
      },
      {
        q: 'Can I use barcode scanning to add products?',
        a: 'Yes. Simply point your phone camera at any barcode and Arali will recognize the product instantly. If the product is in our database, it auto-fills the name and category. If not, you just type the name once and it remembers it for future scans.'
      },
      {
        q: 'How do the smart alerts work?',
        a: 'Smart alerts use AI to analyze your sales patterns and stock levels. They notify you about things like: products that are selling faster than usual, stock that is running low, items approaching expiry, and opportunities to reorder at the right time. Available on Growth and Pro plans.'
      },
      {
        q: 'Can I manage multiple stores?',
        a: 'Yes. The Growth plan supports up to 5 stores, and the Pro plan supports unlimited stores. Each store has its own inventory, reports, and alerts, but you can see a combined view from your dashboard. You can switch between stores with one tap.'
      },
      {
        q: 'What reports and analytics does Arali provide?',
        a: 'Arali provides daily, weekly, and monthly reports covering: total sales, top-selling products, slow-moving items, waste prevented, profit margins, and stock levels. Advanced plans include demand forecasting, trend analysis, and custom dashboards.'
      },
      {
        q: 'Does Arali support WhatsApp notifications?',
        a: 'Yes, on the Pro plan. You can receive critical alerts like low stock warnings, expiry reminders, and daily summary reports directly on WhatsApp. This means you never miss an important notification even if you do not open the app.'
      },
      {
        q: 'Can I export my data?',
        a: 'Yes. On Growth and Pro plans, you can export your inventory, sales data, and reports as CSV or Excel files at any time. Your data belongs to you — we make it easy to take it wherever you need it.'
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing & Billing',
    icon: CreditCard,
    description: 'Plans, payments, and upgrades',
    color: 'bg-green-50 text-green-500',
    faqs: [
      {
        q: 'How much does Arali cost?',
        a: 'Arali has a free plan that works forever with 100 products. Paid plans start at just &#8377;499/month for Starter, &#8377;1,499/month for Growth (most popular), and &#8377;3,999/month for Pro. Yearly billing saves you 20%. Enterprise pricing is custom.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, debit cards, credit cards, net banking, and wallets like Paytm and PhonePe through Razorpay. All payments are processed securely — we never store your card details on our servers.'
      },
      {
        q: 'Can I switch plans anytime?',
        a: 'Yes. You can upgrade instantly — the price difference is prorated for the remaining billing period. If you downgrade, your current features stay active until the end of the billing cycle. No penalties or hidden fees.'
      },
      {
        q: 'What happens when I hit my product limit?',
        a: 'Arali will let you know when you are approaching your limit. You can continue using all existing features — we never delete your data. You just cannot add new products until you upgrade or remove some existing ones.'
      },
      {
        q: 'Is there a contract or lock-in period?',
        a: 'No contracts, ever. Monthly plans are month-to-month. Yearly plans can be cancelled anytime with a prorated refund for the unused months. You are never locked in.'
      },
      {
        q: 'Do you offer discounts for NGOs or government shops?',
        a: 'Yes. We offer special pricing for registered NGOs, government fair-price shops, cooperative societies, and bulk accounts. Contact us at support@arali.app with your registration details and we will set up your discount.'
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    description: 'Your data safety and privacy',
    color: 'bg-red-50 text-red-500',
    faqs: [
      {
        q: 'Is my shop data safe?',
        a: 'Extremely safe. We use bank-level AES-256 encryption for all data, both in transit and at rest. Your data is stored on secure servers with regular backups. We are SOC 2 compliant and follow industry best practices for data security.'
      },
      {
        q: 'Do you sell my data to anyone?',
        a: 'Absolutely not. Your data is yours and only yours. We do not sell, share, or use your data for advertising purposes. We do not share individual shop data with competitors, vendors, or any third party. This is a core promise of Arali.'
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'If you cancel a paid plan, you keep access until the billing period ends. After that, your account reverts to the Free plan. Your data is preserved for 90 days. You can export everything at any time. After 90 days of inactivity, data is securely deleted.'
      },
      {
        q: 'Can my employees see all the data?',
        a: 'You control who sees what. With role management (Growth plan and above), you can set different access levels. For example, a billing assistant can record sales but cannot see profit margins or change prices. Only the owner has full access.'
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical & Offline',
    icon: Wifi,
    description: 'Connectivity, devices, and troubleshooting',
    color: 'bg-amber-50 text-amber-500',
    faqs: [
      {
        q: 'What happens if I lose internet connection?',
        a: 'Arali works offline for core tasks like recording sales, updating stock, and checking product details. All changes are saved locally and sync automatically when your connection is restored. You will never lose any data due to connectivity issues.'
      },
      {
        q: 'Does Arali work on old phones?',
        a: 'Yes. Arali is optimized to work smoothly on phones with as little as 2GB of RAM. It works on Android 8.0 and above, and iOS 13 and above. We continuously optimize for performance on lower-end devices.'
      },
      {
        q: 'How much phone storage does Arali use?',
        a: 'The app itself takes about 25MB. Your data is stored primarily on our servers, so it uses very little additional phone storage. Even shops with 2,000+ products use less than 50MB total on their device.'
      },
      {
        q: 'Can I use Arali on multiple devices?',
        a: 'Yes. Your account syncs across all devices. You can use Arali on your phone, your partner\'s phone, a tablet at the counter, and a computer at home. All data stays in sync in real-time.'
      },
      {
        q: 'What languages does Arali support?',
        a: 'Currently, Arali is available in English, Hindi, Tamil, Telugu, Kannada, and Marathi. We are adding more languages based on user demand. The interface is designed with simple icons and minimal text so it is easy to use regardless of language.'
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & Community',
    icon: MessageCircle,
    description: 'Getting help when you need it',
    color: 'bg-teal-50 text-teal-500',
    faqs: [
      {
        q: 'How can I reach customer support?',
        a: 'You can reach us through WhatsApp (fastest), email at support@arali.app, or the in-app chat. Free plan users get email support. Paid plan users get priority support with faster response times. Pro plan users have access to phone support.'
      },
      {
        q: 'What are the support hours?',
        a: 'Our support team is available Monday to Saturday, 8 AM to 9 PM IST. WhatsApp messages sent outside these hours are answered first thing the next morning. Critical issues (like account access problems) are handled with priority.'
      },
      {
        q: 'Is there a community of Arali users?',
        a: 'Yes! We have an active WhatsApp community of 800+ shop owners who share tips, ask questions, and help each other. It is a great place to learn from experienced retailers and stay updated on new features.'
      },
      {
        q: 'Can I suggest new features?',
        a: 'We love hearing from our users. You can submit feature requests through the app, email, or our community group. Our roadmap is community-driven — many of our best features came from user suggestions. Every request is read by a human.'
      },
    ],
  },
];

// ────────────────────────────────────────
// Hero
// ────────────────────────────────────────

function FAQHero({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (v: string) => void }) {
  return (
    <section className="relative pt-8 pb-20 bg-gradient-to-b from-[#F5F9FC] to-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0F4C81]/3 rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #0F4C81 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0F4C81]/10 bg-white/70 backdrop-blur-sm text-[#0F4C81] text-xs font-medium uppercase tracking-widest mb-8"
          >
            <HelpCircle size={14} />
            Help Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter text-[#0F4C81] leading-[0.95] mb-6"
          >
            Got questions?<br />
            <span className="text-[#0F4C81]/40">We have answers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-[#082032]/45 font-light max-w-xl mx-auto mb-10"
          >
            Clear answers. No jargon. Everything you need to know about Arali in plain, simple language.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-lg mx-auto relative"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0F4C81]/25 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-13 pr-5 h-14 rounded-full bg-white text-[#082032] placeholder:text-[#082032]/25 border-2 border-[#0F4C81]/10 focus:outline-none focus:border-[#0F4C81]/30 text-base shadow-lg shadow-[#0F4C81]/5 transition-colors"
            />
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-[#082032]/30"
          >
            <span>Popular:</span>
            {['Free plan', 'Offline mode', 'Data safety', 'Setup time'].map((q, qi) => (
              <button
                key={qi}
                onClick={() => setSearchQuery(q)}
                className="px-3 py-1.5 rounded-full bg-white border border-[#0F4C81]/10 text-[#0F4C81]/60 hover:text-[#0F4C81] hover:border-[#0F4C81]/25 transition-colors"
              >
                {q}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Category Navigator
// ────────────────────────────────────────

function CategoryNav({ activeCategory, setActiveCategory }: {
  activeCategory: string | null;
  setActiveCategory: (v: string | null) => void;
}) {
  return (
    <section className="py-10 bg-white border-b border-[#0F4C81]/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 border ${
              activeCategory === null
                ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-lg shadow-[#0F4C81]/15'
                : 'bg-white text-[#082032]/50 border-[#0F4C81]/10 hover:border-[#0F4C81]/25 hover:text-[#0F4C81]'
            }`}
          >
            <Sparkles size={14} />
            All Topics
          </button>
          {FAQ_CATEGORIES.map((cat, ci) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: ci * 0.03 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 border ${
                activeCategory === cat.id
                  ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-lg shadow-[#0F4C81]/15'
                  : 'bg-white text-[#082032]/50 border-[#0F4C81]/10 hover:border-[#0F4C81]/25 hover:text-[#0F4C81]'
              }`}
            >
              <cat.icon size={14} />
              {cat.title}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// FAQ Accordion
// ────────────────────────────────────────

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#0F4C81]/8 rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F5F9FC]/50 transition-colors"
      >
        <span className="text-sm font-semibold text-[#082032] pr-4">{item.q}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isOpen ? 'bg-[#0F4C81] text-white' : 'bg-[#0F4C81]/5 text-[#0F4C81]'
        }`}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          className="px-6 pb-5"
        >
          <p className="text-sm text-[#082032]/55 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.a }} />
        </motion.div>
      )}
    </div>
  );
}

// ────────────────────────────────────────
// FAQ Sections
// ────────────────────────────────────────

function FAQSections({ categories, searchQuery }: { categories: FAQCategory[]; searchQuery: string }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const q = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(
        f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.faqs.length > 0);
  }, [categories, searchQuery]);

  if (filteredCategories.length === 0) {
    return (
      <section className="py-20 bg-[#F5F9FC]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F4C81]/5 text-[#0F4C81]/30 mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-semibold text-[#082032] mb-2">No results found</h3>
          <p className="text-sm text-[#082032]/40 mb-4">We could not find an answer matching your search.</p>
          <p className="text-sm text-[#082032]/40">
            Try different keywords, or <Link to="/get-started" className="text-[#0F4C81] underline">contact our support team</Link>.
          </p>
        </div>
      </section>
    );
  }

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.faqs.length, 0);

  return (
    <section className="py-16 bg-[#F5F9FC]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {searchQuery.trim() && (
            <p className="text-sm text-[#082032]/35 mb-8">
              Showing {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}

          <div className="space-y-12">
            {filteredCategories.map((cat, ci) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.05 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center`}>
                    <cat.icon size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#082032]">{cat.title}</h2>
                    <p className="text-xs text-[#082032]/35">{cat.description}</p>
                  </div>
                </div>

                {/* FAQ items */}
                <div className="space-y-2">
                  {cat.faqs.map((faq, fi) => {
                    const key = `${cat.id}-${fi}`;
                    return (
                      <FAQAccordion
                        key={key}
                        item={faq}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
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
// Quick Stats
// ────────────────────────────────────────

function QuickStats() {
  return (
    <section className="py-14 bg-white border-b border-[#0F4C81]/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: '38+', label: 'Questions answered', icon: HelpCircle },
            { value: '6', label: 'Topic categories', icon: BookOpen },
            { value: '<2 min', label: 'Average read time', icon: Clock },
            { value: '4.9/5', label: 'Helpfulness rating', icon: Star },
          ].map((stat, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: si * 0.05 }}
              className="flex items-center gap-3"
            >
              <stat.icon size={16} className="text-[#0F4C81]/30" />
              <div className="text-left">
                <p className="text-sm font-bold text-[#082032]">{stat.value}</p>
                <p className="text-[11px] text-[#082032]/35">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Still Have Questions CTA
// ────────────────────────────────────────

function StillHaveQuestions() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-[#082032]/40">
            Our team is here to help. Choose the way that works best for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            {
              icon: MessageCircle,
              title: 'WhatsApp',
              desc: 'Chat with us on WhatsApp for instant help. Fastest response, usually within minutes.',
              action: 'Chat now',
              color: 'bg-green-50 text-green-500 border-green-100',
            },
            {
              icon: Mail,
              title: 'Email',
              desc: 'Send us a detailed question at support@arali.app. We respond within 4 hours.',
              action: 'Send email',
              color: 'bg-blue-50 text-blue-500 border-blue-100',
            },
            {
              icon: Users,
              title: 'Community',
              desc: 'Join 800+ shop owners on our WhatsApp group. Learn tips and get peer advice.',
              action: 'Join group',
              color: 'bg-violet-50 text-violet-500 border-violet-100',
            },
          ].map((channel, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.1 }}
              className={`rounded-2xl p-7 border text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${channel.color}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <channel.icon size={22} />
              </div>
              <h3 className="text-base font-bold text-[#082032] mb-2">{channel.title}</h3>
              <p className="text-xs text-[#082032]/45 leading-relaxed mb-4">{channel.desc}</p>
              <Button variant="ghost" className="text-sm text-[#0F4C81] font-semibold">
                {channel.action} <ArrowRight size={14} className="ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Testimonial Strip
// ────────────────────────────────────────

function TestimonialStrip() {
  return (
    <section className="py-16 bg-[#0F4C81] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-lg text-white/70 leading-relaxed mb-5 italic">
            &ldquo;I had so many questions before starting. The support team answered everything on WhatsApp in 10 minutes. Now I cannot imagine running my shop without Arali.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-sm font-bold text-white">MK</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Meena K.</p>
              <p className="text-xs text-white/35">Grocery Store, Bangalore</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Quick Tips Section
// ────────────────────────────────────────

function QuickTips() {
  return (
    <section className="py-20 bg-[#F5F9FC]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            <Lightbulb size={12} className="inline mr-1.5" />
            Quick tips
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-4">
            Get the most out of Arali.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            { icon: Clock, title: 'Daily 5 minutes', desc: 'Spend just 5 minutes each morning checking your dashboard. This simple habit reveals what needs attention before problems grow.' },
            { icon: Bell, title: 'Enable alerts', desc: 'Turn on expiry and low stock alerts. They work in the background and save you from surprises. Most users save money within the first week.' },
            { icon: BarChart3, title: 'Sunday review', desc: 'Every Sunday, check your weekly report. It shows your best sellers, waste prevented, and where your money went.' },
            { icon: Download, title: 'Export monthly', desc: 'Download your monthly report as a spreadsheet. Share it with your accountant or keep it for your own records.' },
          ].map((tip, ti) => (
            <motion.div
              key={ti}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ti * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-[#0F4C81]/5 hover:shadow-lg hover:shadow-[#0F4C81]/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] mb-4">
                <tip.icon size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#082032] mb-2">{tip.title}</h3>
              <p className="text-xs text-[#082032]/45 leading-relaxed">{tip.desc}</p>
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
    <section className="py-24 bg-gradient-to-b from-white to-[#F5F9FC] relative overflow-hidden">
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
            Ready to start?
          </h2>
          <p className="text-xl text-[#082032]/45 mb-10 leading-relaxed">
            Join 2,500+ shop owners who took the first step. Setup takes less than 5 minutes and the Free plan is forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="h-14 px-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg rounded-full shadow-xl shadow-[#0F4C81]/10 transition-transform hover:scale-[1.02]">
                Start for free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" className="h-14 px-10 text-[#0F4C81] hover:bg-[#0F4C81]/5 text-lg rounded-full">
                Read the blog
              </Button>
            </Link>
          </div>
          <p className="text-sm text-[#082032]/25 mt-6">
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

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleCategories = activeCategory
    ? FAQ_CATEGORIES.filter(c => c.id === activeCategory)
    : FAQ_CATEGORIES;

  return (
    <div className="flex flex-col">
      <FAQHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <QuickStats />
      <CategoryNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <FAQSections categories={visibleCategories} searchQuery={searchQuery} />
      <TestimonialStrip />
      <QuickTips />
      <StillHaveQuestions />
      <FinalCTA />
    </div>
  );
}
