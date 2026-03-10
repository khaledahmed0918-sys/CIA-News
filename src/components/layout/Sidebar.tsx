import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BarChart2,
  Users,
  FileText,
  AlertTriangle,
  Info,
  Image as ImageIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TableProperties
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const navItems = [
  { name: 'الرئيسية', path: '/', icon: Home },
  { name: 'الجدول', path: '/schedule', icon: TableProperties },
  { name: 'التحليلات والثريدات', path: '/analytics', icon: BarChart2 },
  { name: 'حسابات أعضاء CIA', path: '/streamers', icon: Users },
  { name: 'القضايا', path: '/cases', icon: FileText },
  { name: 'المطلوبين', path: '/wanted', icon: AlertTriangle },
  { name: 'صور الشخصيات', path: '/characters', icon: ImageIcon },
  { name: 'معلومات عامة', path: '/general', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : (isMobile ? 0 : 80),
          x: isMobile && !isOpen ? 280 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 right-0 h-screen z-[100] flex flex-col border-l border-white/10 bg-[#0f172a]/80 backdrop-blur-md shadow-2xl overflow-hidden transform-gpu",
          // Right-to-left layout for Arabic
          "rtl:left-auto rtl:right-0 ltr:right-auto ltr:left-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30 overflow-hidden">
                  <img src="https://i.postimg.cc/d18NsWjp/IMG-9068.jpg" alt="CIA Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-xl font-bold text-blue-100 tracking-wider font-mono">CIA News</h1>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-lg hover:bg-white/10 text-blue-200 transition-colors"
          >
            {isOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? toggleSidebar : undefined}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-blue-600/20 text-blue-100 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-500/30" 
                  : "text-blue-300/70 hover:bg-white/5 hover:text-blue-200 hover:pl-6"
              )}
            >
              <item.icon size={24} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110")} />
              
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Active Indicator Line */}
              <div className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full transition-all duration-300",
                "opacity-0 group-hover:opacity-100",
                // Active state handled by NavLink isActive logic if needed, but here generic hover effect
              )} />
            </NavLink>
          ))}
        </nav>

        {/* Footer User Info (Optional) */}
        <div className="p-4 border-t border-white/10">
           {isOpen && (
             <div className="text-xs text-center text-blue-400/50 font-mono">
               v1.0.0 • 2026
             </div>
           )}
        </div>
      </motion.aside>
    </>
  );
};
