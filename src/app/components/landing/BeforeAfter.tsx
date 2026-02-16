import React from 'react';
import { motion } from 'motion/react';
import {
  FileText, AlertCircle, HelpCircle, Frown,
  Smartphone, Bell, Smile, TrendingUp,
  ArrowRight, X, Check
} from 'lucide-react';

const beforeItems = [
  { icon: FileText, text: 'Scribbling stock in notebooks', detail: 'Pages tear, numbers blur, history lost' },
  { icon: AlertCircle, text: 'Discovering expired items too late', detail: 'Money thrown in the bin every week' },
  { icon: HelpCircle, text: '"Do I have that in stock?"', detail: 'Walking to the shelf to check every time' },
  { icon: Frown, text: 'No idea if today was profitable', detail: 'Guessing until the month-end' },
];

const afterItems = [
  { icon: Smartphone, text: 'Every item tracked digitally', detail: 'Search, filter, know instantly' },
  { icon: Bell, text: 'Alerts before anything expires', detail: 'Create discounts in one tap' },
  { icon: TrendingUp, text: 'Real-time sales dashboard', detail: 'Know your profit before closing' },
  { icon: Smile, text: 'Leave work at work, sleep easy', detail: 'Peace of mind, every single day' },
];

export function BeforeAfter() {
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
            The difference
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Before & after Arali.
          </h2>
          <p className="text-xl text-[#082032]/60 leading-relaxed">
            See how shop owners transform their daily routine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-red-200/50 shadow-lg shadow-red-500/5 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-300" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <X size={20} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#082032]">Without Arali</h3>
                  <p className="text-xs text-[#082032]/40">The daily struggle</p>
                </div>
              </div>
              <div className="space-y-5">
                {beforeItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={16} className="text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-[#082032]/80 text-sm">{item.text}</p>
                      <p className="text-xs text-[#082032]/40 mt-0.5">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#0F4C81]/15 shadow-xl shadow-[#0F4C81]/10 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F4C81] to-[#0F4C81]/60" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                  <Check size={20} className="text-[#0F4C81]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F4C81]">With Arali</h3>
                  <p className="text-xs text-[#0F4C81]/50">The smarter way</p>
                </div>
              </div>
              <div className="space-y-5">
                {afterItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={16} className="text-[#0F4C81]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#082032] text-sm">{item.text}</p>
                      <p className="text-xs text-[#082032]/50 mt-0.5">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Arrow between */}
        <div className="hidden lg:flex justify-center -mt-[280px] mb-[220px] relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="w-14 h-14 rounded-full bg-[#0F4C81] text-white flex items-center justify-center shadow-xl shadow-[#0F4C81]/30"
          >
            <ArrowRight size={22} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
