import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const imgTestimonial1 = "https://images.unsplash.com/photo-1753351050724-511764d227e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwb3duZXIlMjBzbWlsaW5nJTIwc2hvcCUyMGNvdW50ZXJ8ZW58MXx8fHwxNzcwOTE0NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgTestimonial2 = "https://images.unsplash.com/photo-1563649685437-a79731028cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBncm9jZXJ5JTIwc3RvcmUlMjBvd25lciUyMHJldGFpbHxlbnwxfHx8fDE3NzA5MTQ1OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgTestimonial3 = "https://images.unsplash.com/photo-1530028877439-c742c97d1543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNob3AlMjBvd25lciUyMGJvdXRpcXVlJTIwaGFwcHl8ZW58MXx8fHwxNzcwOTE0NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const testimonials = [
  {
    name: 'Ramesh Gupta',
    role: 'Grocery Store Owner',
    location: 'Anantapur',
    image: imgTestimonial1,
    quote: "Before Arali, I was throwing away ₹8,000 worth of expired goods every month. Now I get alerts 5 days before anything expires. Last month I lost only ₹400. That's real money saved.",
    metric: '₹7,600/mo saved',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Kirana Store Owner',
    location: 'Hyderabad',
    image: imgTestimonial3,
    quote: "My husband thought I was wasting time on the phone. Then he saw I tracked every single item in our 2,000-product shop without a single notebook. Now he uses it too.",
    metric: '2,000 items tracked',
    stars: 5,
  },
  {
    name: 'Suresh Kumar',
    role: 'Provision Store',
    location: 'Bangalore',
    image: imgTestimonial2,
    quote: "I used to spend 2 hours every Sunday counting stock. Now I open Arali and see everything — what's selling, what's not, what needs reordering. Sunday is now for family.",
    metric: '2 hrs/week saved',
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F4C81]/3 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
            Real stories
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
            Loved by shop owners<br />across India.
          </h2>
          <p className="text-xl text-[#082032]/60 leading-relaxed">
            Don't take our word for it — hear from retailers who transformed their business with Arali.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative bg-[#F5F9FC] rounded-3xl p-8 border border-[#0F4C81]/5 hover:border-[#0F4C81]/15 hover:shadow-xl hover:shadow-[#0F4C81]/5 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-[#0F4C81]/5 group-hover:text-[#0F4C81]/10 transition-colors">
                <Quote size={40} />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#082032]/70 leading-relaxed text-sm mb-6">
                "{t.quote}"
              </p>

              {/* Metric badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold mb-6">
                {t.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-[#0F4C81]/5">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#082032]">{t.name}</p>
                  <p className="text-xs text-[#082032]/40">{t.role} · {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
