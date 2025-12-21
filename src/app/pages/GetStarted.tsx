import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function GetStarted() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="pt-20 pb-32 min-h-screen flex items-center justify-center bg-[#F5F9FC]">
      <div className="container mx-auto px-6 max-w-lg">
        <motion.div {...fadeInUp} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#0F4C81]/5 relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-2 bg-[#EBF4FA] w-full">
            <div 
              className="h-full bg-[#0F4C81] transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          <div className="mb-8">
            <span className="text-sm font-medium text-[#0F4C81]/60 uppercase tracking-wide">Step {step} of 3</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0F4C81] mt-2">
              {step === 1 && "Create your shop account"}
              {step === 2 && "Log your first purchase"}
              {step === 3 && "You're ready to go!"}
            </h2>
          </div>

          {step === 1 && (
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
                <div>
                  <label className="block text-sm font-medium text-[#082032]/70 mb-2">Shop Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] outline-none transition-all"
                    placeholder="e.g. Green Valley Grocers"
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#082032]/70 mb-2">Owner Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] outline-none transition-all"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  />
                </div>
                <Button onClick={handleNext} className="w-full h-12 rounded-full bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg mt-4">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             </motion.div>
          )}

          {step === 2 && (
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-6"
             >
                <div className="bg-[#EBF4FA] p-6 rounded-2xl mb-6">
                  <p className="text-sm text-[#082032]/70 mb-4">Let's simulate adding an item.</p>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                     <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-full flex items-center justify-center text-[#0F4C81]">
                        🥛
                     </div>
                     <div>
                        <div className="font-medium text-[#0F4C81]">Fresh Milk (1L)</div>
                        <div className="text-xs text-gray-500">Exp: 3 days from now</div>
                     </div>
                  </div>
                </div>
                <Button onClick={handleNext} className="w-full h-12 rounded-full bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg">
                  Confirm & Add <Check className="ml-2 w-4 h-4" />
                </Button>
                <button onClick={() => setStep(1)} className="w-full text-center text-sm text-[#0F4C81]/60 hover:text-[#0F4C81] mt-2">
                   Back
                </button>
             </motion.div>
          )}

          {step === 3 && (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-8"
             >
                <div className="w-20 h-20 bg-[#0F4C81]/10 rounded-full flex items-center justify-center text-[#0F4C81] mx-auto mb-6">
                   <Check size={40} />
                </div>
                <h3 className="text-xl font-medium text-[#0F4C81] mb-2">Welcome to Arali</h3>
                <p className="text-[#082032]/70 mb-8">
                   Your shop is now set up. We've sent a confirmation to your device.
                </p>
                <Link to="/dashboard">
                   <Button className="w-full h-12 rounded-full bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white text-lg">
                      Go to Dashboard
                   </Button>
                </Link>
             </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}