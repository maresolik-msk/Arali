import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Bell, TrendingUp, Lightbulb, PiggyBank } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function Features() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Purchase Logging",
      desc: "Quickly add items as they arrive. Categorize by type and set expiry dates effortlessly.",
      color: "bg-[#0F4C81]/5 text-[#0F4C81]"
    },
    {
      icon: Bell,
      title: "Expiry Alerts",
      desc: "Get notified days before items go bad. Never throw away money silently again.",
      color: "bg-[#0F4C81]/10 text-[#0F4C81]"
    },
    {
      icon: TrendingUp,
      title: "Slow & Fast Movers",
      desc: "Identify which products fly off the shelves and which ones are gathering dust.",
      color: "bg-[#0F4C81]/15 text-[#0F4C81]"
    },
    {
      icon: Lightbulb,
      title: "Action Suggestions",
      desc: "Not sure what to do with nearing-expiry stock? Arali gives you smart, proven ideas.",
      color: "bg-[#0F4C81]/20 text-[#0F4C81]"
    },
    {
      icon: PiggyBank,
      title: "Weekly Savings",
      desc: "Visualise your savings. See exactly how much waste you prevented each week.",
      color: "bg-[#0F4C81]/25 text-[#0F4C81]"
    }
  ];

  return (
    <div className="pt-20 pb-32">
        {/* Hero Banner */}
        <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden mb-20">
             <img 
               src="https://images.unsplash.com/photo-1631541911232-72bc7448820a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc21hbGwlMjBzaG9wJTIwaW50ZXJpb3IlMjB3YXJtJTIwdG9uZXN8ZW58MXx8fHwxNzY1OTAzNTY3fDA&ixlib=rb-4.1.0&q=80&w=1080" 
               alt="Peaceful shop interior"
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-[#0F4C81]/40 mix-blend-multiply"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <motion.div {...fadeInUp} className="text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">Powerful, yet simple.</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
                        Everything you need to run a smarter shop, without the clutter of enterprise software.
                    </p>
                </motion.div>
             </div>
        </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-[#0F4C81]/5 hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#0F4C81] mb-3">{feature.title}</h3>
              <p className="text-[#082032]/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
