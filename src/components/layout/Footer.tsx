import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github } from 'lucide-react';

const DiscordIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor" className={className}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a67.58,67.58,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
  </svg>
);

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
              <button onClick={copyDiscord} className="text-[#5865F2] hover:text-[#4752C4] transition-colors cursor-pointer flex items-center gap-1" title="Copy Discord User">
                <DiscordIcon size={18} />
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
