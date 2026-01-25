import React from 'react';
import { Link } from 'react-router';
import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import { usePlan } from '../hooks/usePlan';
import { PlanLimits } from '../constants/pricing';

interface FeatureGuardProps {
  feature: keyof PlanLimits;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function FeatureGuard({ feature, children, title, description }: FeatureGuardProps) {
  const { checkLimit } = usePlan();
  
  // checkLimit handles boolean limits by returning !!limit
  // passing 0 as currentCount is fine for boolean checks
  const allowed = checkLimit(feature, 0);

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Lock className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-3">
        {title || 'Feature Locked'}
      </h2>
      <p className="text-[#082032]/60 max-w-md mb-8 text-lg">
        {description || 'This feature is not available in your current plan. Upgrade your plan to access advanced tools and insights.'}
      </p>
      <Link to="/select-plan?mode=upgrade">
        <Button size="lg" className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 rounded-full shadow-lg shadow-[#0F4C81]/20 transition-all hover:scale-105 active:scale-95">
          Upgrade Plan
        </Button>
      </Link>
    </div>
  );
}