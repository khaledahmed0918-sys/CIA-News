import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { casesData } from '@/data/cases';

export const Cases: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-100 mb-8 border-b border-white/10 pb-4">القضايا والملفات</h2>
      
      <div className="grid grid-cols-1 gap-12">
        {casesData.map((item) => (
          <GlassCard key={item.id} className="p-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-red-200 border-r-4 border-red-500 pr-4">{item.subject}</h3>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <p className="text-blue-100/80 leading-loose text-lg whitespace-pre-line text-justify">
                    {item.content}
                  </p>
                </div>
                
                <div 
                  className="w-full lg:w-1/3 h-64 lg:h-auto min-h-[300px] rounded-xl overflow-hidden relative cursor-pointer group shadow-2xl border border-white/10"
                  onClick={() => setSelectedImage(item.image)}
                >
                  <img 
                    src={item.image} 
                    alt={item.subject} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                   <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm">عرض الدليل</span>
                  </div>
                </div>
              </div>
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
