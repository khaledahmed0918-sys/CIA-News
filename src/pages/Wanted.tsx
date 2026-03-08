import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { wantedData } from '@/data/wanted';

export const Wanted: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-red-500 mb-8 border-b border-red-500/30 pb-4 flex items-center gap-3">
        <span className="animate-pulse">⚠️</span> قائمة المطلوبين
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wantedData.map((person) => (
          <GlassCard key={person.id} className="p-4 flex flex-col items-center group hover:bg-red-900/10 transition-colors border-red-500/20">
            <div 
              className="w-full aspect-square rounded-xl overflow-hidden mb-4 relative cursor-pointer border-2 border-red-500/30"
              onClick={() => setSelectedImage(person.image)}
            >
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                loading="lazy"
              />
              
              {/* WANTED Stamp Effect */}
              <div className="absolute top-2 right-2 border-2 border-red-600 text-red-600 px-2 py-1 text-xs font-black tracking-widest rotate-[-15deg] opacity-70">
                WANTED
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-red-100 text-center">{person.name}</h3>
            <div className="mt-2 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
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
