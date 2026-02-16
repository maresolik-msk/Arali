import React from 'react';
import { motion } from 'motion/react';
import { Shield, Star, Users, MapPin } from 'lucide-react';

export function TrustBar() {
  const stats = [
    { icon: Users, value: '2,500+', label: 'Shop Owners' },
    { icon: MapPin, value: '45+', label: 'Cities' },
    { icon: Star, value: '4.9/5', label: 'Rating' },
    { icon: Shield, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="relative py-6 bg-white border-y border-[#0F4C81]/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12 lg:gap-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#082032]/30 mr-2">
            Trusted by retailers
          </span>
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <stat.icon size={16} className="text-[#0F4C81]/40" />
              <span className="text-lg font-bold text-[#0F4C81]">{stat.value}</span>
              <span className="text-sm text-[#082032]/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
