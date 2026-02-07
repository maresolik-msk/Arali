import React from 'react';
import { motion } from 'motion/react';
import { Plus, Bell, ChartColumn, Clock } from 'lucide-react';

const imgWatchFreshness = "https://images.unsplash.com/photo-1605447813584-26aeb3f8e6ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBzdXBlcm1hcmtldCUyMHNoZWxmfGVufDF8fHx8MTc2OTkzNjI2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Log Your Stock",
      desc: "Log new stock in seconds. Just tap, select category, and add expiry date. No complex forms or barcodes needed if you don't want them.",
      icon: Plus,
      color: "bg-[#0F4C81]/5 text-[#0F4C81]",
      image: "https://images.unsplash.com/photo-1764795849885-e226e3cabe87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc2NjY0NTYyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "02",
      title: "Watch Freshness",
      desc: "Arali quietly watches your inventory. Items are sorted by freshness, so you always know what needs to be sold first.",
      icon: Clock,
      color: "bg-[#0F4C81]/10 text-[#0F4C81]",
      image: imgWatchFreshness
    },
    {
      id: "03",
      title: "Act Before Expiry",
      desc: "Get gentle notifications before items expire. Arali suggests actions: discount it, bundle it, or put it on display.",
      icon: Bell,
      color: "bg-[#0F4C81]/15 text-[#0F4C81]",
      image: "https://images.unsplash.com/photo-1758520387659-9956c4516891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbm90aWZpY2F0aW9ucyUyMHJldGFpbHxlbnwxfHx8fDE3NjY2NDU2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: "04",
      title: "See Your Progress",
      desc: "Receive a simple Sunday report. See how much waste you prevented each week.",
      icon: ChartColumn,
      color: "bg-[#0F4C81]/20 text-[#0F4C81]",
      image: "https://images.unsplash.com/photo-1753351052617-62818ffc9173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHNob3AlMjBvd25lciUyMGJ1c2luZXNzfGVufDF8fHx8MTc2NjY0NTYzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="pt-[32px] pb-[128px] pr-[0px] pl-[0px]">
      <div className="container mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6">How Arali works</h1>
          <p className="text-xl text-[#082032]/70">
            A simple rhythm for your shop. Designed to be learned in minutes, not days.
          </p>
        </motion.div>

        <div className="space-y-32">
          {steps.map((step, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 w-full"
              >
                <div className="bg-white rounded-3xl aspect-[4/3] shadow-lg border border-[#0F4C81]/5 flex items-center justify-center relative overflow-hidden group">
                   <img 
                    src={step.image} 
                    alt={step.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className={`absolute inset-0 bg-[#0F4C81] opacity-20 mix-blend-multiply`}></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                   
                   {/* Icon Overlay */}
                   <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10">
                     <div className={`w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-[#0F4C81]`}>
                       <step.icon size={24} />
                     </div>
                     <span className="text-white font-medium text-lg tracking-wide">{step.title}</span>
                   </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 1 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1"
              >
                
                <h2 className="text-3xl font-semibold text-[#0F4C81] mb-4">{step.title}</h2>
                <p className="text-lg text-[#082032]/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}