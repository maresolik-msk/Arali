import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function WhyArali() {
  const comparisons = [
    {
      title: "Vs. Paper Notebooks",
      arali: "Searchable history, automatic alerts, never gets lost.",
      others: "Hard to search, pages tear, no reminders.",
    },
    {
      title: "Vs. Complex Billing Apps",
      arali: "Focused purely on waste & flow. Learn in 5 mins.",
      others: " bloated with features you don't use. Hard to learn.",
    },
    {
      title: "Vs. Doing Nothing",
      arali: "Save money every week. Sleep better.",
      others: "Lose money silently. Constant low-level anxiety.",
    }
  ];

  return (
    <div className="pt-[32px] pb-[128px] pr-[0px] pl-[0px]">
      <div className="container mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6">Why switch to Arali?</h1>
          <p className="text-xl text-[#082032]/70">
            It's not just about technology. It's about a better way to work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {comparisons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#0F4C81]/10"
            >
              <div className="p-8 bg-[#F5F9FC] border-b border-[#0F4C81]/5">
                <h3 className="text-xl font-semibold text-[#0F4C81]">{item.title}</h3>
              </div>
              <div className="p-8 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#0F4C81] font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-xs">
                      <Check size={14} />
                    </div>
                    With Arali
                  </div>
                  <p className="text-[#082032]/70 pl-8">{item.arali}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#082032]/50 font-medium">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
                      <X size={14} />
                    </div>
                    Others
                  </div>
                  <p className="text-[#082032]/50 pl-8">{item.others}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
