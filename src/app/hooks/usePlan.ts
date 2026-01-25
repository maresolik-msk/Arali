import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PricingPlan, PRICING_PLANS, DEFAULT_PLAN, PlanLimits } from '../constants/pricing';

export function usePlan() {
  const { user } = useAuth();
  
  const currentPlan = (user?.plan as PricingPlan) || DEFAULT_PLAN;
  const limits = PRICING_PLANS[currentPlan] || PRICING_PLANS[DEFAULT_PLAN];

  const checkLimit = (
    limitKey: keyof PlanLimits, 
    currentCount: number
  ): boolean => {
    const limit = limits[limitKey];
    if (typeof limit === 'number') {
      return currentCount < limit;
    }
    return !!limit;
  };

  return {
    currentPlan,
    limits,
    checkLimit,
    // Convenience flags
    isFree: currentPlan === PricingPlan.FREE,
    isStarter: currentPlan === PricingPlan.STARTER,
    isGrowth: currentPlan === PricingPlan.GROWTH,
    isPro: currentPlan === PricingPlan.PRO,
    isEnterprise: currentPlan === PricingPlan.ENTERPRISE,
  };
}
