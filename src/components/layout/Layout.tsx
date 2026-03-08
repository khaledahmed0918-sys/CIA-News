import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white font-sans selection:bg-blue-500/30 selection:text-blue-100 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px]" />
      </div>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <BottomNav isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <motion.main
        className="relative z-10 flex flex-col min-h-screen transition-all duration-300 ease-in-out will-change-transform pb-24 lg:pb-0"
        style={{ 
          marginRight: isMobile ? 0 : (isSidebarOpen ? 320 : 120), // Increased margin for gap
          marginLeft: 0 // RTL layout
        }}
      >
        <div className="flex-1 p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            <div
              key={location.pathname}
              className="w-full animate-in fade-in duration-300"
            >
              {children}
            </div>
        </div>
        <Footer />
      </motion.main>
    </div>
  );
};
