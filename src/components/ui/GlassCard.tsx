import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0f172a]/80 backdrop-blur-md shadow-lg",
        hoverEffect && "hover:bg-[#1e293b]/80 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay instead of noise image for better performance */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)]" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
