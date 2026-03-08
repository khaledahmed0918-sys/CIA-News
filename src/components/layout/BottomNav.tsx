import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, AlertTriangle, Menu, X, BarChart2, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BottomNavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const leftNavItems = [
  { name: 'الرئيسية', path: '/', icon: Home },
  { name: 'الستريمرز', path: '/streamers', icon: Users },
  { name: 'القضايا', path: '/cases', icon: FileText },
];

const rightNavItems = [
  { name: 'المطلوبين', path: '/wanted', icon: AlertTriangle },
  { name: 'التحليلات', path: '/analytics', icon: BarChart2 },
  { name: 'معلومات', path: '/general', icon: Info },
];

export const BottomNav: React.FC<BottomNavProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[110] flex items-center justify-between px-2 py-2 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transform-gpu">
      
      {/* Left Icons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-around">
        {leftNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "p-2 sm:p-2.5 rounded-full transition-all duration-300",
              isActive 
                ? "bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                : "text-blue-300/50 hover:bg-white/5 hover:text-blue-200"
            )}
          >
            <item.icon size={20} />
          </NavLink>
        ))}
      </div>

      {/* Center Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mx-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all duration-300 shrink-0 transform hover:scale-105 active:scale-95 border-2 border-[#0f172a]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Right Icons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-around">
        {rightNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "p-2 sm:p-2.5 rounded-full transition-all duration-300",
              isActive 
                ? "bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                : "text-blue-300/50 hover:bg-white/5 hover:text-blue-200"
            )}
          >
            <item.icon size={20} />
          </NavLink>
        ))}
      </div>
      
    </div>
  );
};
