import React from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true, ...props }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0f172a]/80 backdrop-blur-md shadow-lg transform-gpu transition-all duration-300 ease-in-out",
        hoverEffect && "hover:bg-[#1e293b]/80 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay instead of noise image for better performance */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)]" />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
