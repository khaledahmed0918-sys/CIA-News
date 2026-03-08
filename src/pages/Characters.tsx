import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { analyticsData } from '@/data/analytics';
import { casesData } from '@/data/cases';
import { wantedData } from '@/data/wanted';

export const Characters: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Aggregate all images
  const allImages = [
    ...analyticsData.map(i => ({ src: i.image, title: i.subject, category: 'شخصيات' })),
    ...casesData.map(i => ({ src: i.image, title: i.subject, category: 'قضايا' })),
    ...wantedData.map(i => ({ src: i.image, title: i.name, category: 'مطلوبين' })),
  ];

  // Remove duplicates based on src
  const uniqueImages = Array.from(new Map(allImages.map(item => [item.src, item])).values());

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-100 mb-8 border-b border-white/10 pb-4">معرض الصور</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {uniqueImages.map((img, idx) => (
          <GlassCard key={idx} className="p-2 group overflow-hidden hover:shadow-blue-500/20 transition-all duration-300">
            <div 
              className="relative overflow-hidden rounded-xl cursor-pointer aspect-[3/4]"
              onClick={() => setSelectedImage(img.src)}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">{img.category}</span>
                <h3 className="text-white font-bold text-lg">{img.title}</h3>
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

