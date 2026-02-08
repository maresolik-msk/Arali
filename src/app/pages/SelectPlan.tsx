import React, { useState } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PLAN_DETAILS, PricingPlan } from '../constants/pricing';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/auth';
import { toast } from 'sonner';

export function SelectPlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isUpgrade = searchParams.get('mode') === 'upgrade';

  // If user already selected a plan AND not upgrading, redirect to dashboard
  if (user?.hasSelectedPlan && !isUpgrade) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSelectPlan = async (planKey: PricingPlan) => {
    // Only return if plan matches AND user has already explicitly selected a plan
    if (user?.plan === planKey && user?.hasSelectedPlan) return;
    
    try {
      setIsUpdating(true);
      
      await updateUserProfile({
        plan: planKey,
        plan_selected: true,
      });

      toast.success(isUpgrade ? `Upgraded to ${PLAN_DETAILS[planKey].title} Plan!` : `Welcome to the ${PLAN_DETAILS[planKey].title} Plan!`);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error('Failed to update plan. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const plans = [
    PricingPlan.FREE,
    PricingPlan.STARTER,
    PricingPlan.GROWTH,
    PricingPlan.PRO,
    PricingPlan.ENTERPRISE,
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FC] flex flex-col">
      <div className="container mx-auto px-6 py-12 flex-1 flex flex-col justify-center relative">
        {isUpgrade && (
          <Button 
            variant="ghost" 
            className="absolute top-8 left-6 md:left-12 gap-2 text-[#0F4C81]"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        )}
        
        <div className="text-center max-w-3xl mx-auto mb-12 mt-12 md:mt-0">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F4C81] mb-4">
            {isUpgrade ? 'Upgrade Your Plan' : 'Select Your Plan'}
          </h1>
          <p className="text-lg text-[#082032]/60">
            {isUpgrade 
              ? 'Choose a plan that fits your growing business needs.' 
              : 'Welcome to Arali! Choose a plan to unlock your dashboard.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((planKey) => {
            const plan = PLAN_DETAILS[planKey];
            const isPopular = plan.popular;
            const isCurrent = user?.plan === planKey;

            return (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative flex flex-col bg-white rounded-2xl shadow-xl border ${
                  isCurrent 
                    ? 'border-green-500 ring-4 ring-green-500/10' 
                    : isPopular 
                      ? 'border-[#0F4C81] ring-4 ring-[#0F4C81]/10' 
                      : 'border-[#0F4C81]/10'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Current Plan
                  </div>
                )}
                
                {!isCurrent && isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0F4C81] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Recommended
                  </div>
                )}

                <div className="p-6 flex-1">
                  <h3 className="text-lg font-bold text-[#0F4C81] mb-2">{plan.title}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-[#082032]">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-xs text-[#082032]/60">/mo</span>}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#082032]/80">
                        <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Button 
                    onClick={() => handleSelectPlan(planKey)}
                    disabled={isUpdating || (isCurrent && !!user?.hasSelectedPlan)}
                    className={`w-full ${
                      isCurrent && !!user?.hasSelectedPlan
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isPopular || (isCurrent && !user?.hasSelectedPlan)
                          ? 'bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white' 
                          : 'bg-[#F5F9FC] text-[#0F4C81] hover:bg-[#0F4C81]/10'
                    }`}
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : (isCurrent && !!user?.hasSelectedPlan) ? 'Current Plan' : (isCurrent && !user?.hasSelectedPlan) ? 'Continue' : isUpgrade ? 'Upgrade' : 'Select'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {!isUpgrade && (
          <div className="mt-8 text-center">
             <button 
               onClick={() => handleSelectPlan(PricingPlan.FREE)}
               className="text-sm text-[#082032]/40 hover:text-[#0F4C81] underline"
             >
               Continue with Free Plan
             </button>
          </div>
        )}
      </div>
    </div>
  );
}