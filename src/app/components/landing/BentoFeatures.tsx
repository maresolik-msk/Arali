import React from 'react';
import { motion } from 'motion/react';
import {
  Scan, Clock, BarChart3, MessageSquare,
  Shield, Wifi, Zap, Globe, Smartphone
} from 'lucide-react';

const imgBarcode = "https://images.unsplash.com/photo-1758543102397-e14b5dfdd8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjb2RlJTIwc2Nhbm5lciUyMHJldGFpbCUyMGludmVudG9yeXxlbnwxfHx8fDE3NzA5MTQ2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const imgDashboard = "https://images.unsplash.com/photo-1697545805858-556ce0a508cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50JTIwdGFibGV0JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MDkxNDU5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function BentoFeatures() {
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
            Packed with features
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Everything you need.<br />Nothing you don't.
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
          {/* Large card - Barcode Scanner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 bg-gradient-to-br from-[#0F4C81] to-[#0a3a65] rounded-3xl p-8 md:p-10 relative overflow-hidden group min-h-[280px] flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                <Scan size={24} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Barcode Scanner</h3>
              <p className="text-white/70 max-w-md text-base leading-relaxed">
                Point your phone camera at any product barcode. Arali instantly identifies it, pulls up details, and lets you log it in seconds.
              </p>
            </div>
            {/* Image overlay */}
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity">
              <img src={imgBarcode} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81] via-[#0F4C81]/80 to-transparent pointer-events-none" />
          </motion.div>

          {/* Smart Expiry Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-amber-50 rounded-3xl p-7 relative overflow-hidden group min-h-[280px] flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
              <Clock size={24} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">Expiry Tracking</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed mb-4">
              Automatic alerts 7, 3, and 1 days before items expire. Never waste money again.
            </p>
            {/* Mini visualization */}
            <div className="mt-auto space-y-2">
              {['7 days', '3 days', '1 day'].map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`h-2 rounded-full ${i === 0 ? 'bg-green-300 w-full' : i === 1 ? 'bg-amber-300 w-3/4' : 'bg-red-300 w-1/3'}`} />
                  <span className="text-[10px] text-[#082032]/40 whitespace-nowrap">{d}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Works Offline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#F5F9FC] rounded-3xl p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center mb-5">
              <Wifi size={24} className="text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">Works Offline</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed">
              Bad internet? No problem. Arali works offline and syncs automatically when you're back online.
            </p>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-[#F5F9FC] rounded-3xl p-7 relative overflow-hidden group flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center mb-5">
              <BarChart3 size={24} className="text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">Simple Analytics</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed">
              See your top sellers, daily revenue, and profit margins at a glance. No spreadsheets needed.
            </p>
          </motion.div>

          {/* Large card - WhatsApp Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-green-50 rounded-3xl p-7 relative overflow-hidden group flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
              <MessageSquare size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">WhatsApp Alerts</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed mb-4">
              Share stock updates and special offers with your customers directly on WhatsApp. Drive footfall effortlessly.
            </p>
            {/* Mock WhatsApp message */}
            <div className="mt-auto bg-white rounded-xl p-3 shadow-sm border border-green-100">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">A</span>
                </div>
                <div className="text-[11px] text-[#082032]/70">
                  <span className="font-semibold text-[#082032]">Arali Store</span>
                  <br />
                  Fresh mangoes just arrived! 🥭 ₹120/kg — today only. Visit us at Shop #12, Main Road.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Multi-language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-[#F5F9FC] rounded-3xl p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center mb-5">
              <Globe size={24} className="text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">Multi-language</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed">
              Use Arali in English, Hindi, Telugu, or Kannada. Your shop, your language.
            </p>
          </motion.div>

          {/* PWA - Install anywhere */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-[#F5F9FC] rounded-3xl p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center mb-5">
              <Smartphone size={24} className="text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">Install Anywhere</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed">
              No app store needed. Install directly from your browser on any phone, tablet, or computer.
            </p>
          </motion.div>

          {/* Secure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="bg-[#F5F9FC] rounded-3xl p-7 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center mb-5">
              <Shield size={24} className="text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-bold text-[#082032] mb-2">Bank-level Security</h3>
            <p className="text-[#082032]/60 text-sm leading-relaxed">
              Your data is encrypted and backed up automatically. Only you can access your shop's information.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
