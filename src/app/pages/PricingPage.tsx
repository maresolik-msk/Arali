import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PLAN_DETAILS, PricingPlan } from '../constants/pricing';

export function PricingPage() {
  const plans = [
    PricingPlan.FREE,
    PricingPlan.STARTER,
    PricingPlan.GROWTH,
    PricingPlan.PRO,
    PricingPlan.ENTERPRISE,
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FC]">
      {/* Header Spacer */}
      

      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F4C81] mb-6">
            Simple Pricing for Smart Retailers
          </h1>
          <p className="text-xl text-[#082032]/60">
            Choose the plan that fits your business stage. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((planKey) => {
            const plan = PLAN_DETAILS[planKey];
            const isPopular = plan.popular;

            return (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col bg-white rounded-2xl shadow-xl border ${
                  isPopular ? 'border-[#0F4C81] ring-4 ring-[#0F4C81]/10' : 'border-[#0F4C81]/10'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0F4C81] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="p-6 flex-1">
                  <h3 className="text-lg font-bold text-[#0F4C81] mb-2">{plan.title}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-[#082032]">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-sm text-[#082032]/60">/month</span>}
                  </div>
                  <p className="text-sm text-[#082032]/60 mb-6 min-h-[40px]">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#082032]/80">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link to="/get-started">
                    <Button 
                      className={`w-full ${
                        isPopular 
                          ? 'bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white' 
                          : 'bg-[#F5F9FC] text-[#0F4C81] hover:bg-[#0F4C81]/10'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}