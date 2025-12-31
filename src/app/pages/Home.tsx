import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleAlert, TrendingDown, EyeOff, ClipboardList, Check, X, Smartphone, Bell, ChartColumn, Clock } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Home() {
  return (
    <div className="flex flex-col gap-0">
      
      {/* 4.1 Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-[#F5F9FC]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center justify-between">
            <div className="max-w-2xl lg:w-5/12">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0F4C81]/10 bg-white/50 backdrop-blur-sm text-[#0F4C81] text-xs font-medium uppercase tracking-widest mb-10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]"></span>
                Simple Inventory for Shops
              </motion.div>

              <motion.h1 
                {...fadeInUp}
                className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-[#0F4C81] leading-[0.95] mb-10"
              >
                Run your business with <br />
                <span className="text-[#0F4C81]/40">quiet confidence.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl md:text-2xl text-[#082032]/60 font-light leading-relaxed max-w-lg mb-12"
              >
                Reduce waste, track inventory, and grow visibility. No complex tools, just peace of mind.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <Link to="/get-started">
                  <Button className="h-14 px-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-[#F5F9FC] text-lg rounded-full w-full sm:w-auto shadow-xl shadow-[#0F4C81]/10 transition-transform hover:scale-[1.02]">
                    Start for free
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="ghost" className="h-14 px-10 text-[#0F4C81] hover:bg-[#0F4C81]/5 text-lg rounded-full w-full sm:w-auto">
                    How it works
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:w-6/12 relative"
            >
                <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[6/5] overflow-hidden rounded-[3rem]">
                  <img 
                    src="https://images.unsplash.com/photo-1753161029114-857c9f494ccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wJTIwb3duZXIlMjB0YWJsZXR8ZW58MXx8fHwxNzY2NjQ1NjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Shop owner managing inventory"
                    className="w-full h-full object-cover grayscale-[10%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C81]/20 to-transparent mix-blend-multiply opacity-60"></div>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4.2 Problem Reality Section */}
      <section className="py-24 bg-[#EBF4FA]">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81]"> The hidden cost of running a shop.</h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: ClipboardList, title: "Paper Tracking", desc: "Notebooks get lost, pages tear, and history fades." },
              { icon: TrendingDown, title: "Unsold Stock", desc: "Expired goods mean wasted money, every single week." },
              { icon: EyeOff, title: "No Visibility", desc: "Customers don't know what you have until they walk in." },
              { icon: CircleAlert, title: "Daily Anxiety", desc: "Not knowing if you'll break even today." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="bg-[#F5F9FC] p-8 rounded-2xl shadow-sm border border-[#0F4C81]/5"
              >
                <div className="w-12 h-12 rounded-full bg-[#0F4C81]/5 flex items-center justify-center mb-6 text-[#0F4C81]">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-medium text-[#082032] mb-3">{item.title}</h3>
                <p className="text-[#082032]/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4.3 Arali's Core Solution */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F4C81]/5 rounded-full blur-[100px] opacity-60" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0F4C81]/5 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeInUp} className="mb-20 text-center max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-semibold tracking-wider uppercase mb-6">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#0F4C81] mb-6 leading-tight">
              Simple steps.<br/>Better business flow.
            </h2>
            <p className="text-xl text-[#082032]/60 leading-relaxed">
              Managing a shop shouldn't feel like a second job. Arali streamlines your daily operations into three clear actions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                icon: ClipboardList, 
                step: "01",
                title: "Track Instantly", 
                desc: "Log purchases in seconds. No complex forms—just snap, type, and you're done." 
              },
              { 
                icon: Bell, 
                step: "02",
                title: "Watch Quietly", 
                desc: "Get subtle alerts before items expire. We keep an eye on dates so you don't have to." 
              },
              { 
                icon: TrendingDown, 
                step: "03", 
                title: "Act Decisively", 
                desc: "Discount fast to move stock before it spoils. Turn potential losses into cash." 
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#0F4C81]/10 shadow-lg shadow-[#0F4C81]/5 hover:shadow-2xl hover:shadow-[#0F4C81]/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-8 right-8 text-7xl font-bold text-[#0F4C81]/5 select-none leading-none">
                  {item.step}
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#0F4C81] text-white flex items-center justify-center mb-8 shadow-lg shadow-[#0F4C81]/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <item.icon size={28} strokeWidth={2} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#0F4C81] mb-4">{item.title}</h3>
                  <p className="text-[#082032]/70 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.4 Daily Shop Life Integration */}
      <section className="py-24 bg-[#0F4C81] text-[#F5F9FC] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 {...fadeInUp} className="text-3xl md:text-5xl font-semibold mb-8">
                Fits into your day.<br />
                Doesn't disrupt it.
              </motion.h2>
              <div className="space-y-12">
                {[
                  { time: "Morning", text: "Check alerts while opening the shutters." },
                  { time: "Mid-day", text: "Log new stock when the delivery arrives." },
                  { time: "Evening", text: "Review the day's wins in 2 minutes." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
                    className="flex gap-6 border-l border-[#F5F9FC]/20 pl-8"
                  >
                    <span className="text-[#F5F9FC]/40 font-medium tracking-wide uppercase text-sm">{item.time}</span>
                    <p className="text-xl font-light">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
               <img 
                src="https://images.unsplash.com/photo-1719407812772-3695fc7d335c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXRhaWwlMjBzdG9yZSUyMGludGVyaW9yJTIwZGVzaWduJTIwYmx1ZSUyMHRoZW1lfGVufDF8fHx8MTc2NTk4ODc1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern retail store" 
                className="rounded-2xl opacity-90 shadow-2xl grayscale-[20%] sepia-[10%]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4.5 Proof of Value */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-[#0F4C81]/10">
            {[
              { value: "30%", label: "Less Waste", desc: "Average reduction in expired stock." },
              { value: "2hrs", label: "Saved Weekly", desc: "Time gained from manual checking." },
              { value: "Zero", label: "Learning Curve", desc: "Designed for non-tech people." }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="pt-8 md:pt-0 px-4"
              >
                <div className="text-5xl md:text-6xl font-bold text-[#0F4C81] mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-[#0F4C81] mb-2">{stat.label}</div>
                <div className="text-[#082032]/60">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.6 Visibility & Footfall */}
      <section className="py-24 bg-white border-y border-[#0F4C81]/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="order-2 lg:order-1 relative"
             >
                <div className="rounded-3xl overflow-hidden shadow-xl max-w-sm mx-auto lg:mx-0 relative z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1584645297262-ef07a731c296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMGhvbGRpbmclMjBwaG9uZSUyMHNob3BwaW5nJTIwcmV0YWlsJTIwYmx1ZSUyMGFic3RyYWN0fGVufDF8fHx8MTc2NTk4ODc1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                    alt="Customer checking updates"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0F4C81]/10 mix-blend-multiply"></div>
                </div>

                <div className="absolute bottom-8 right-8 left-8 md:-right-6 md:left-auto bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#0F4C81]/10 rotate-[-2deg] z-10 max-w-xs">
                    <div className="flex gap-3 items-center mb-3">
                        <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-full flex items-center justify-center text-[#0F4C81] font-bold">A</div>
                        <div>
                          <div className="font-semibold text-sm">Arali Store Update</div>
                          <div className="text-xs text-gray-500">Today, 10:00 AM</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-800">
                        Fresh stock alert! 🥬<br/>
                        Organic Spinach bundles are 20% off today only. Come visit before they're gone!
                    </div>
                </div>
             </motion.div>
             <div className="order-1 lg:order-2">
                <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6">
                  Turn shelf-stock<br/>
                  into footfall.
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-[#082032]/70 leading-relaxed mb-8"
                >
                  When you know what you have, you can tell your customers. Arali helps you create simple updates to share on WhatsApp or social media.
                </motion.p>
                <Link to="/features" className="text-[#0F4C81] font-medium hover:underline inline-flex items-center">
                  Explore features <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 4.7 Who It's For */}
      <section className="py-24 bg-[#EBF4FA]">
         <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-16 max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-semibold text-[#0F4C81] mb-6">Honesty first.</h2>
               <p className="text-xl text-[#082032]/60">
                 We built Arali for specific needs. We'd rather you not sign up if we're not the right fit.
               </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
                 className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-[#0F4C81]/10 border border-[#0F4C81]/10 relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#0F4C81]"></div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-[#E6F0F9] flex items-center justify-center text-[#0F4C81]">
                        <Check size={24} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F4C81]">Perfect for you</h3>
                  </div>
                  
                  <ul className="space-y-6">
                     {[
                        { title: "Small Shop Owners", desc: "Grocery, retail, or boutique shops." },
                        { title: "Peace Seekers", desc: "You want to leave work at work." },
                        { title: "Perishable Goods", desc: "You sell items that expire." },
                        { title: "Non-Techies", desc: "You prefer pen & paper over Excel." }
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                           <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0F4C81] shrink-0" />
                           <div>
                               <span className="block text-[#082032] font-semibold text-lg">{item.title}</span>
                               <span className="text-[#082032]/60">{item.desc}</span>
                           </div>
                        </li>
                     ))}
                  </ul>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
                 className="p-10 md:p-12 rounded-[2.5rem] border-2 border-dashed border-[#0F4C81]/20 opacity-80 hover:opacity-100 transition-opacity"
               >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <X size={24} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#082032]/60">Probably not for you</h3>
                  </div>

                  <ul className="space-y-6">
                     {[
                        { title: "Big Supermarkets", desc: "If you have >10 checkout lanes." },
                        { title: "Supply Chain Pros", desc: "If you need warehousing logistics." },
                        { title: "Dropshippers", desc: "We focus on physical, in-store inventory." },
                        { title: "Data Analysts", desc: "If you need complex pivot tables." }
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-[#082032]/50">
                           <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#082032]/20 shrink-0" />
                           <div>
                               <span className="block text-[#082032]/70 font-semibold text-lg">{item.title}</span>
                               <span className="">{item.desc}</span>
                           </div>
                        </li>
                     ))}
                  </ul>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 4.8 Final CTA */}
      <section className="py-32 bg-[rgb(255,255,255)] text-[#F5F9FC]">
         <div className="container mx-auto px-6 text-center">
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="text-3xl md:text-5xl font-semibold mb-6 text-[rgb(15,76,129)]"
            >
               Ready to take back control?
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="text-xl text-[#F5F9FC]/70 mb-10 max-w-xl mx-auto text-[rgba(65,85,98,0.7)]"
            >
               Join the quiet revolution of smart retail owners. No credit card required.
            </motion.p>
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
               <Link to="/get-started">
                  <Button className="h-14 px-10 bg-[rgb(15,76,129)] hover:bg-[#F5F9FC]/90 text-[rgb(255,255,255)] text-lg rounded-full">
                     Get Started Now
                  </Button>
               </Link>
            </motion.div>
         </div>
      </section>
      
    </div>
  );
}