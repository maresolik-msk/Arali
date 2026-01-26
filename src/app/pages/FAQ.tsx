import React from 'react';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function FAQ() {
  const faqs = [
    {
      q: "Do I need a computer to use Arali?",
      a: "No. Arali is designed to work perfectly on your smartphone. You can use it on a tablet or computer if you prefer, but it's not required."
    },
    {
      q: "Is my data safe?",
      a: "Yes. Your shop's data is private and secure. We do not sell your data to anyone."
    },
    {
      q: "What happens if I lose internet connection?",
      a: "Arali works offline for basic tasks. Your data will sync automatically once you're back online."
    },
    {
      q: "Can I export my data?",
      a: "Absolutely. You can download your inventory and sales reports as a simple spreadsheet at any time."
    },
    {
      q: "How much does it cost?",
      a: "We have a free tier for small shops. Our premium plan includes advanced analytics and multi-user support for growing businesses."
    }
  ];

  return (
    <div className="pt-[32px] pb-[128px] pr-[0px] pl-[0px]">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6">Common Questions</h1>
          <p className="text-xl text-[#082032]/70">
            Clear answers. No jargon.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#0F4C81]/10">
                <AccordionTrigger className="text-lg font-medium text-[#0F4C81] hover:text-[#0F4C81]/80 py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#082032]/70 text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
