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
        {casesData.map((item, index) => (
          <GlassCard key={item.id} className="p-8 overflow-hidden relative group">
            {/* Decorative background element */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 via-transparent to-transparent opacity-50" />
            
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-2xl font-bold text-red-200 border-r-4 border-red-500 pr-4 pl-2">
                    {item.subject}
                 </h3>
                 <span className="text-xs font-mono text-blue-400/50 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/10">
                    CASE #{item.id}
                 </span>
              </div>
              
              <div className={`flex flex-col xl:flex-row gap-8 ${index % 2 === 1 ? 'xl:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <p className="text-blue-100/80 leading-loose text-lg whitespace-pre-line text-justify font-light">
                    {item.content}
                  </p>
                </div>
                
                <div 
                  className="w-full xl:w-[400px] shrink-0"
                  onClick={() => setSelectedImage(item.image)}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer group/image aspect-video xl:aspect-[4/3]">
                    <img 
                      src={item.image} 
                      alt={item.subject} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-white bg-black/60 px-6 py-2 rounded-full backdrop-blur-md text-sm border border-white/20 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                        عرض الدليل
                      </span>
                    </div>
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

