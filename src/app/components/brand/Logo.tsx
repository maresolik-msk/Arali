import React from 'react';
import svgPaths from '../../../imports/svg-jjtvzygm37';
import { cn } from '../ui/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

function AraliIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 size-[42px]", className)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
        <g>
          <path d={svgPaths.p3ba4b300} fill="currentColor" />
          <path d={svgPaths.p12543c00} fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}

export function Logo({ className, iconClassName, textClassName }: LogoProps) {
  return (
    <div className={cn("flex flex-row items-center gap-[2px]", className)}>
      <div className="flex gap-[0 px] items-center justify-center relative">
        <AraliIcon className={cn("text-[#0F4C81]", iconClassName)} />
        <span className={cn("font-medium tracking-wide text-[#0F4C81] text-lg uppercase", textClassName)}>
          Arali
        </span>
      </div>
    </div>
  );
}
