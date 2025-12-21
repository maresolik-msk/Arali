import React from 'react';
import { motion } from 'motion/react';

const fadeInUp = {
  initial: { opacity: 0, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function Story() {
  return (
    <div className="pt-20 pb-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div {...fadeInUp} className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6">Built from the shop floor.</h1>
        </motion.div>

        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg text-[#082032]/80 mx-auto"
          >
            <p className="text-xl leading-relaxed mb-8">
              Arali wasn't born in a Silicon Valley boardroom. It started in a small grocery store in a bustling neighborhood.
            </p>
            <p className="mb-6">
              We watched shop owners—our neighbors—struggle with a silent problem. Every week, perfectly good products were being thrown away because they were hidden at the back of a shelf, forgotten until the expiry date had passed.
            </p>
            <p className="mb-6">
              Notebooks were messy. Enterprise software was too expensive and complicated. Doing nothing was costing them money every single day.
            </p>
            <p>
              So we built Arali. Not to disrupt retail, but to bring a sense of calm and control to the people who feed our communities.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden aspect-video shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1694427367174-eabda4e0398a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHNob3AlMjBmcm9udCUyMG1pbmltYWwlMjBleHRlcmlvcnxlbnwxfHx8fDE3NjU5MDI3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Quiet shop front"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0F4C81]/20 mix-blend-multiply"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-medium text-[#0F4C81] mb-4">Our Mission</h2>
            <p className="text-xl font-light text-[#082032]/70 italic">
              "To help small retailers succeed by reducing waste, one product at a time."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
