import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Disc as Discord, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const copyDiscord = () => {
    navigator.clipboard.writeText('221.k');
    alert('تم نسخ يوزر الديسكورد: 221.k');
  };

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-md py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* CIA News Section */}
        <div className="flex items-center gap-4">
          <img 
            src="https://i.postimg.cc/5y73ywc0/IMG-9068.jpg" 
            alt="CIA News Avatar" 
            className="w-12 h-12 rounded-full border-2 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
          <div>
            <h3 className="text-lg font-bold text-blue-100">CIA News</h3>
            <div className="flex gap-3 mt-1">
              <a href="https://x.com/cianews_?s=21" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-blue-200/60 font-mono">
          © 2026 CIA News. All rights reserved.
        </div>

        {/* Developer Section */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h3 className="text-lg font-bold text-blue-100">Mohammed</h3>
            <div className="flex gap-3 mt-1 justify-end">
              <a href="https://x.com/i_mohammedqht?s=21" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Twitter size={18} />
              </a>
              <button onClick={copyDiscord} className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer" title="Copy Discord User">
                <span className="font-bold text-xs">DISCORD</span>
              </button>
            </div>
          </div>
          <img 
            src="https://i.postimg.cc/VNnDgrMm/IMG-4848.jpg" 
            alt="Mohammed Avatar" 
            className="w-12 h-12 rounded-full border-2 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        </div>

      </div>
    </footer>
  );
};
