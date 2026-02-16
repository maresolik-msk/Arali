import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import {
  ArrowRight, Heart, Leaf, Eye, Users, Lightbulb,
  HandHeart, Shield, Star, Zap, MapPin,
  Milestone, Rocket, Trophy, Globe, Target,
  BookOpen, Sparkles, Quote, ChevronRight
} from 'lucide-react';

const IMG_SHOP_EXTERIOR = "https://images.unsplash.com/photo-1765376260865-98c52cd9c0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY2NjM3NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_FOOD_WASTE = "https://images.unsplash.com/photo-1646668949229-f815c28d55f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBpcmVkJTIwZm9vZCUyMHdhc3RlJTIwZ3JvY2VyeSUyMHByb2R1Y3RzfGVufDF8fHx8MTc3MDkxNjY0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_SHOPKEEPER = "https://images.unsplash.com/photo-1766716946030-5869da2a0ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzaG9wa2VlcGVyJTIwcmV0YWlsJTIwY291bnRlciUyMG1vcm5pbmd8ZW58MXx8fHwxNzcwOTE2NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_SUNRISE = "https://images.unsplash.com/photo-1534432189786-f47e376dc8c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwdGhyb3VnaCUyMHdpbmRvdyUyMHdhcm0lMjBsaWdodCUyMGhvcGV8ZW58MXx8fHwxNzcwOTE2NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_TEAM = "https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMHRvZ2V0aGVyJTIwc3RhcnR1cCUyMG9mZmljZSUyMGRpdmVyc2V8ZW58MXx8fHwxNzcwOTE2NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_PLANT = "https://images.unsplash.com/photo-1710596220294-3f88dfe02fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG91cmlzaGluZyUyMGdyZWVuJTIwcGxhbnQlMjBncm93dGglMjBuYXR1cmV8ZW58MXx8fHwxNzcwOTE2NjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_MARKET = "https://images.unsplash.com/photo-1758540853499-5f7422dd9f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGxvY2FsJTIwZ3JvY2VyeSUyMG1hcmtldCUyMG5laWdoYm9yaG9vZHxlbnwxfHx8fDE3NzA5MTY2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_COMMUNITY = "https://images.unsplash.com/photo-1769634306787-7f2fff1cca7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXN5JTIwbWFya2V0cGxhY2UlMjB2aWJyYW50JTIwbG9jYWwlMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcwOTE2NjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const IMG_LEDGER = "https://images.unsplash.com/photo-1595014361672-72bae0e6eaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMGhhbmR3cml0dGVuJTIwbGVkZ2VyJTIwb2xkJTIwcmVjb3Jkc3xlbnwxfHx8fDE3NzA5MTY2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// ────────────────────────────────────────
// 1. Hero — Cinematic opening
// ────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={IMG_SHOP_EXTERIOR} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#082032]/90 via-[#082032]/70 to-[#082032]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/80 via-transparent to-[#082032]/30" />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/70 text-xs font-medium uppercase tracking-widest mb-8"
          >
            <BookOpen size={14} />
            Our story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter text-white leading-[0.95] mb-8"
          >
            Built from the<br />
            <span className="text-white/50">shop floor.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/50 font-light leading-relaxed max-w-xl mb-10"
          >
            Arali was not born in a boardroom. It started with a quiet problem we watched happen every single day — and a belief that it did not have to be that way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {['AK', 'PS', 'RD'].map((initials, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-[#0F4C81] border-2 border-white/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{initials}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">The founding team</p>
              <p className="text-xs text-white/30">3 people, 1 mission, 0 wasted products</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ────────────────────────────────────────
// 2. The Moment — The specific spark
// ────────────────────────────────────────

function TheMoment() {
  return (
    <section className="py-24 md:py-36 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8">
              Where it began
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] leading-tight mb-8">
              A Wednesday morning<br />that changed everything.
            </h2>
          </motion.div>

          {/* Story grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-[#082032]/60 leading-relaxed">
                It was 7 AM in a neighborhood grocery store. The owner — a man who wakes at 5 every day, six days a week — was pulling expired milk cartons off the shelf. Twelve units. Gone.
              </p>
              <p className="text-lg text-[#082032]/60 leading-relaxed">
                He stood there for a moment, doing the math in his head. Twelve cartons at &#8377;55 each. That is &#8377;660 lost before the first customer walked in. And this happened every week.
              </p>
              <p className="text-lg text-[#082032]/60 leading-relaxed">
                Not because he was careless. Because he was busy — busy serving customers, managing deliveries, negotiating with vendors. The expiry date was just one more thing to track, and he was already tracking a hundred.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              {/* Image */}
              <div className="rounded-3xl overflow-hidden aspect-[4/3] relative group shadow-xl">
                <img src={IMG_SHOPKEEPER} alt="Shop owner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/50 to-transparent" />
              </div>

              {/* Stat callout */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <p className="text-sm text-red-400 font-medium uppercase tracking-wider mb-1">The silent cost</p>
                <p className="text-2xl font-bold text-red-600 mb-1">&#8377;2,600 - &#8377;8,000</p>
                <p className="text-xs text-red-400">Lost to waste every month by an average small retailer in India</p>
              </div>
            </motion.div>
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#F5F9FC] rounded-3xl p-8 md:p-12 border border-[#0F4C81]/5"
          >
            <Quote size={32} className="text-[#0F4C81]/10 absolute top-6 left-6" />
            <p className="text-xl md:text-2xl text-[#0F4C81] font-medium leading-relaxed text-center italic max-w-2xl mx-auto">
              &ldquo;I work harder than anyone I know. But no amount of hard work can help me remember the expiry date of 400 different products.&rdquo;
            </p>
            <p className="text-sm text-[#082032]/40 text-center mt-4">
              — The shopkeeper who inspired Arali
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 3. The Problem — Visual waste story
// ────────────────────────────────────────

function TheProblem() {
  return (
    <section className="py-24 md:py-36 bg-[#082032] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/60 text-xs font-semibold tracking-wider uppercase mb-8">
              The problem
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Small shops lose big.
            </h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
              India has 12 million+ small retailers. Together, they lose crores every year to a problem that is entirely preventable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                stat: '&#8377;92,000 Cr',
                label: 'Annual food waste in India',
                desc: 'Enough to feed 200 million people for a year',
                color: 'from-red-500/20 to-red-500/5',
                borderColor: 'border-red-500/20',
              },
              {
                stat: '40%',
                label: 'Perishables wasted',
                desc: 'Nearly half of all perishable goods expire before being sold',
                color: 'from-amber-500/20 to-amber-500/5',
                borderColor: 'border-amber-500/20',
              },
              {
                stat: '78%',
                label: 'Use paper records',
                desc: 'Still tracking inventory with notebooks and memory',
                color: 'from-orange-500/20 to-orange-500/5',
                borderColor: 'border-orange-500/20',
              },
            ].map((card, ci) => (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
                className={`rounded-2xl p-7 bg-gradient-to-b ${card.color} border ${card.borderColor} backdrop-blur-sm`}
              >
                <p className="text-3xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: card.stat }} />
                <p className="text-sm font-semibold text-white/70 mb-2">{card.label}</p>
                <p className="text-xs text-white/35">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Side-by-side images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden relative aspect-[3/2] group"
            >
              <img src={IMG_FOOD_WASTE} alt="Food waste" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/80 text-sm font-medium">Products lost before reaching customers</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl overflow-hidden relative aspect-[3/2] group"
            >
              <img src={IMG_LEDGER} alt="Paper records" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/80 text-sm font-medium">Handwritten ledgers tracking hundreds of products</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 4. The Decision — "So we built it"
// ────────────────────────────────────────

function TheDecision() {
  return (
    <section className="py-24 md:py-36 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden aspect-square relative group shadow-2xl shadow-[#0F4C81]/10"
            >
              <img src={IMG_TEAM} alt="Arali team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C81]/40 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8">
                The decision
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] leading-tight mb-6">
                &ldquo;We should build this.&rdquo;
              </h2>
              <div className="space-y-5 text-[#082032]/60 leading-relaxed">
                <p>
                  We did not start with a business plan. We started with a question: what if tracking expiry dates was as easy as reading a text message?
                </p>
                <p>
                  Three of us — from different backgrounds but the same neighborhood — sat down and began building. We spent the first three months not writing code. We spent them in shops. Watching. Listening. Learning.
                </p>
                <p>
                  We learned that shop owners do not need more features. They need less friction. They need tools that feel invisible — that work the way their intuition already works.
                </p>
                <p className="text-[#0F4C81] font-medium">
                  That became our north star: make the software disappear so the shopkeeper can focus on what they do best — serving their community.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 5. The Name — What "Arali" means
// ────────────────────────────────────────

function TheName() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F9FC] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8">
                The name
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] leading-tight mb-6">
                Why &ldquo;Arali&rdquo;?
              </h2>
              <div className="space-y-5 text-[#082032]/60 leading-relaxed">
                <p>
                  <strong className="text-[#082032]">Arali</strong> is a plant that grows across India — hardy, beautiful, and deeply rooted. It thrives in difficult conditions. It does not need constant attention to flourish.
                </p>
                <p>
                  That felt right. We wanted to build something that helps small businesses grow naturally — without needing a team of consultants or a computer science degree.
                </p>
                <p>
                  Like the arali plant, our tool is designed to be resilient. It works offline. It works on old phones. It works in places where the internet is unreliable and the power goes out twice a day.
                </p>
              </div>

              {/* Name card */}
              <div className="mt-8 bg-white rounded-2xl p-6 border border-[#0F4C81]/10 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Leaf size={20} className="text-green-500" />
                  <span className="text-sm font-bold text-[#082032]">Arali (Oleander)</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 font-medium">Hardy</span>
                  <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium">Resilient</span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 font-medium">Beautiful</span>
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 font-medium">Deeply rooted</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden aspect-[4/5] relative group shadow-2xl shadow-green-900/10"
            >
              <img src={IMG_PLANT} alt="Arali plant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082032]/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 6. The Journey — Timeline
// ────────────────────────────────────────

function TheJourney() {
  const milestones = [
    { date: 'Jan 2024', icon: Lightbulb, title: 'The idea', desc: 'Spent 3 months visiting 50+ local shops. Understood the real problem: not lack of tools, but lack of simple tools.', color: 'bg-amber-50 text-amber-500' },
    { date: 'Apr 2024', icon: Rocket, title: 'First prototype', desc: 'Built the first version in 6 weeks. Tested it with 5 shop owners in our neighborhood. 4 out of 5 said they would pay for it.', color: 'bg-blue-50 text-blue-500' },
    { date: 'Jul 2024', icon: Users, title: '100 shops', desc: 'Crossed 100 active shops. Zero marketing spend — every user came from word of mouth. That told us something was working.', color: 'bg-green-50 text-green-500' },
    { date: 'Oct 2024', icon: Sparkles, title: 'AI features launched', desc: 'Added demand forecasting and smart alerts. Shops using these features reduced waste by an additional 35%.', color: 'bg-violet-50 text-violet-500' },
    { date: 'Feb 2025', icon: Trophy, title: '1,000 shops', desc: 'Reached 1,000 shops across 8 cities. Collectively preventing over &#8377;15 lakh in waste every month.', color: 'bg-orange-50 text-orange-500' },
    { date: 'Feb 2026', icon: Globe, title: '2,500+ shops', desc: 'Present in 15+ cities. Launched multi-store support, WhatsApp alerts, and the Growth plan. The journey continues.', color: 'bg-[#0F4C81]/10 text-[#0F4C81]' },
  ];

  return (
    <section className="py-24 md:py-36 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8">
            The journey
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Two years of building<br />with purpose.
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#0F4C81]/5 via-[#0F4C81]/15 to-[#0F4C81]/5" />

          <div className="space-y-10">
            {milestones.map((m, mi) => (
              <motion.div
                key={mi}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: mi * 0.08 }}
                className="flex gap-5 md:gap-7 relative"
              >
                <div className="relative z-10 shrink-0">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${m.color} flex items-center justify-center shadow-sm`}>
                    <m.icon size={20} />
                  </div>
                </div>

                <div className="flex-1 pb-2">
                  <span className="text-xs font-bold text-[#0F4C81]/40 uppercase tracking-wider">{m.date}</span>
                  <h3 className="text-lg font-bold text-[#082032] mt-1 mb-2">{m.title}</h3>
                  <p className="text-sm text-[#082032]/50 leading-relaxed" dangerouslySetInnerHTML={{ __html: m.desc }} />
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
// 7. Our Values — What we believe
// ────────────────────────────────────────

function OurValues() {
  const values = [
    { icon: Eye, title: 'Simplicity first', desc: 'If a feature needs a tutorial, we have failed. Every screen should be understandable in 3 seconds.' },
    { icon: HandHeart, title: 'Empathy over efficiency', desc: 'We build for people, not metrics. Every decision starts with: how does the shop owner feel?' },
    { icon: Shield, title: 'Trust is sacred', desc: 'Your data is yours. We never sell it, share it, or use it for ads. Bank-level encryption, always.' },
    { icon: Leaf, title: 'Sustainability matters', desc: 'Every product saved from waste is a small victory for the planet. We track and celebrate every one.' },
    { icon: Heart, title: 'Community-driven', desc: 'Our roadmap comes from shop owners, not investors. Every feature request is read by a human.' },
    { icon: Zap, title: 'Works everywhere', desc: 'Built for real conditions — slow internet, old phones, power cuts. If you can send a WhatsApp, you can use Arali.' },
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
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8">
            Our values
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            What we believe.
          </h2>
          <p className="text-xl text-[#082032]/50 leading-relaxed">
            These are not just words on a wall. They are decisions we make every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {values.map((v, vi) => (
            <motion.div
              key={vi}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: vi * 0.07 }}
              className="bg-white rounded-2xl p-7 border border-[#0F4C81]/5 hover:shadow-lg hover:shadow-[#0F4C81]/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] mb-5">
                <v.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-[#082032] mb-2">{v.title}</h3>
              <p className="text-sm text-[#082032]/50 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 8. Impact — By the numbers
// ────────────────────────────────────────

function Impact() {
  return (
    <section className="py-24 md:py-32 bg-[#0F4C81] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/60 text-xs font-semibold tracking-wider uppercase mb-8">
            Our impact
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Small tool. Big numbers.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto mb-16">
          {[
            { value: '2,500+', label: 'Shops using Arali' },
            { value: '15+', label: 'Cities across India' },
            { value: '&#8377;2.1 Cr', label: 'Waste prevented' },
            { value: '1.8L+', label: 'Products saved' },
          ].map((stat, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: si * 0.08 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <p className="text-3xl md:text-4xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: stat.value }} />
              <p className="text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Community image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative aspect-[2.5/1] group"
        >
          <img src={IMG_COMMUNITY} alt="Community marketplace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C81]/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <p className="text-white/80 text-lg font-medium">Every shop we help strengthens a community</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 9. Voices — Testimonials
// ────────────────────────────────────────

function Voices() {
  const stories = [
    {
      quote: "Before Arali, I used to throw away &#8377;3,000 worth of dairy products every month. Now that number is less than &#8377;200. My wife noticed the difference before I did — we could finally afford to fix the shop's AC.",
      name: 'Suresh M.',
      role: 'Grocery Store, Pune',
      initials: 'SM',
    },
    {
      quote: "I have been running this shop for 22 years. My son showed me Arali. I was skeptical — I have seen these apps come and go. But this one? It thinks like a shopkeeper. It tells me what I need to know before I need to know it.",
      name: 'Ramachandran P.',
      role: 'General Store, Chennai',
      initials: 'RP',
    },
    {
      quote: "The Sunday report is my favorite thing. I used to spend 2 hours on Sunday evening calculating the week. Now it is just there on my phone when I wake up. That is 2 hours with my kids every week.",
      name: 'Fatima B.',
      role: 'Mini Mart, Hyderabad',
      initials: 'FB',
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-8">
            Their words
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Stories from shop owners.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stories.map((s, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: si * 0.1 }}
              className="bg-[#F5F9FC] rounded-3xl p-7 border border-[#0F4C81]/5 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-[#082032]/60 leading-relaxed flex-1 mb-6" dangerouslySetInnerHTML={{ __html: `&ldquo;${s.quote}&rdquo;` }} />

              <div className="flex items-center gap-3 pt-5 border-t border-[#0F4C81]/5">
                <div className="w-10 h-10 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#0F4C81]">{s.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#082032]">{s.name}</p>
                  <p className="text-[11px] text-[#082032]/40">{s.role}</p>
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
// 10. The Vision — Where we are going
// ────────────────────────────────────────

function TheVision() {
  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={IMG_SUNRISE} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81]/90 via-[#0F4C81]/80 to-[#0F4C81]/60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white/60 text-xs font-semibold tracking-wider uppercase mb-8">
              The vision
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8 leading-tight">
              A world where no product<br />goes to waste.
            </h2>
            <p className="text-xl text-white/50 leading-relaxed mb-12 max-w-xl mx-auto">
              That is the future we are building toward. One shop at a time, one product at a time. Not by disrupting retail — but by quietly empowering the people who already do the hard work.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16"
          >
            {[
              { icon: MapPin, title: 'Every town in India', desc: 'Expanding to 100+ cities by 2027' },
              { icon: Sparkles, title: 'Smarter AI', desc: 'Predictive ordering and demand sensing' },
              { icon: Globe, title: 'Beyond India', desc: 'Small retailers everywhere deserve better tools' },
            ].map((vision, vi) => (
              <div key={vi} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <vision.icon size={22} className="text-white/50 mx-auto mb-3" />
                <p className="text-sm font-bold text-white mb-1">{vision.title}</p>
                <p className="text-xs text-white/35">{vision.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Mission statement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10"
          >
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-4">Our Mission</p>
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed italic">
              &ldquo;To help small retailers succeed by reducing waste, one product at a time — until no product is ever thrown away unnecessarily.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// 11. Final CTA
// ────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
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
            Be part of the story.
          </h2>
          <p className="text-xl text-[#082032]/50 mb-10 leading-relaxed">
            Every shop that joins Arali makes the movement stronger. Start free, grow at your pace, and know that you are not alone.
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
          <p className="text-sm text-[#082032]/30 mt-6">
            No credit card required &middot; Free forever plan &middot; 2,500+ shops and counting
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────
// Main Page
// ────────────────────────────────────────

export function Story() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TheMoment />
      <TheProblem />
      <TheDecision />
      <TheName />
      <TheJourney />
      <OurValues />
      <Impact />
      <Voices />
      <TheVision />
      <FinalCTA />
    </div>
  );
}
