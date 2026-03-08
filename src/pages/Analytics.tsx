import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { analyticsData } from '@/data/analytics';
import { motion } from 'framer-motion';

export const Analytics: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-100 mb-8 border-b border-white/10 pb-4">التحليلات والثريدات</h2>
      
      <div className="grid grid-cols-1 gap-8">
        {analyticsData.map((item, index) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden flex flex-col md:flex-row">
            <div 
              className="w-full md:w-1/3 h-64 md:h-auto relative cursor-pointer group overflow-hidden"
              onClick={() => setSelectedImage(item.image)}
            >
              <img 
                src={item.image} 
                alt={item.subject} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm">عرض الصورة</span>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-blue-200 mb-4">{item.subject}</h3>
              <p className="text-blue-100/80 leading-loose text-lg text-justify">
                {item.content}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage || ''} 
      />
    </div>
  );
};
