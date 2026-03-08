import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { analyticsData } from '@/data/analytics';

interface Analysis {
  id: number | string;
  image_url: string;
  person_name: string;
  message: string;
  characters?: string;
}

const ImageWithLoader = ({ src, alt, onClick }: { src: string, alt: string, onClick?: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="w-full h-64 md:h-96 relative cursor-pointer group overflow-hidden" onClick={onClick}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]/50 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      )}
    </div>
  );
};

export const Analytics: React.FC = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ person_name: '', characters: '', message: '', image_source: 'link', image_url: '', file: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get('/api/analyze');
      const supabaseData = Array.isArray(response.data) ? response.data.map((item: any) => ({
        ...item,
        id: item.id
      })) : [];
      
      const localData = analyticsData.map(item => ({
        id: item.id,
        image_url: item.image,
        person_name: 'CIA', // Default name for local data
        message: item.content,
        characters: item.subject
      }));

      setAnalyses([...supabaseData, ...localData]);
    } catch (error) {
      console.error('Failed to fetch analyses', error);
      // If supabase fails, still show local data
      const localData = analyticsData.map(item => ({
        id: item.id,
        image_url: item.image,
        person_name: 'CIA',
        message: item.content,
        characters: item.subject
      }));
      setAnalyses(localData);
    }
  };

  const handleAdd = async () => {
    if (!formData.person_name || !formData.characters || !formData.message) {
      console.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    if (formData.image_source === 'link' && !formData.image_url) {
      console.error('يرجى إدخال رابط الصورة');
      return;
    }
    
    if (formData.image_source === 'upload' && !formData.file) {
      console.error('يرجى اختيار صورة');
      return;
    }

    setIsUploading(true);
    
    try {
      let imageUrl = '';
      if (formData.image_source === 'link') {
        imageUrl = formData.image_url;
      } else if (formData.file) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.file!);
        });
        const response = await axios.post('/api/upload-image', { image: base64.split(',')[1] });
        imageUrl = response.data.data.url;
      }

      await axios.post('/api/analyze', { image_url: imageUrl, person_name: formData.person_name, message: formData.message, characters: formData.characters });
      
      setIsFormOpen(false);
      fetchAnalyses();
      setFormData({ person_name: '', characters: '', message: '', image_source: 'link', image_url: '', file: null });
    } catch (error: any) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-100">التحليلات والثريدات</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-blue-500">
          <Plus size={20} /> اضف تحليلك/ثريدك
        </button>
      </div>
      
      {analyses.length === 0 ? (
        <div className="text-center text-blue-400 py-20">لا توجد تحليلات حالياً</div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {analyses.map((item) => (
            <GlassCard key={item.id} className="p-0 overflow-hidden flex flex-col">
              {item.image_url && (
                <ImageWithLoader 
                  src={item.image_url} 
                  alt={item.person_name} 
                  onClick={() => setSelectedImage(item.image_url)} 
                />
              )}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-blue-200 mb-4">{item.characters || item.person_name}</h3>
                <p className="text-blue-100/80 leading-loose text-lg text-justify whitespace-pre-wrap">{item.message}</p>
                <div className="mt-6 text-left text-blue-400/60 text-sm font-bold">
                  من : {item.person_name}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFormOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] backdrop-blur-sm bg-black/15 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl w-full max-w-lg space-y-4 shadow-2xl m-auto">
                <h3 className="text-xl font-bold text-white">إضافة تحليل/ثريد جديد</h3>
                <input type="text" placeholder="اكتب اسمك" value={formData.person_name} onChange={e => setFormData({...formData, person_name: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                <input type="text" placeholder="عنوان التحليل/الثريد" value={formData.characters} onChange={e => setFormData({...formData, characters: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                <textarea placeholder="اكتب تحليلك" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white h-32" />
                <div className="flex gap-2">
                  <button onClick={() => setFormData({...formData, image_source: 'link'})} className={`flex-1 p-2 rounded-xl ${formData.image_source === 'link' ? 'bg-blue-600' : 'bg-[#1e293b]'}`}>رابط</button>
                  <button onClick={() => setFormData({...formData, image_source: 'upload'})} className={`flex-1 p-2 rounded-xl ${formData.image_source === 'upload' ? 'bg-blue-600' : 'bg-[#1e293b]'}`}>تحميل</button>
                </div>
                {formData.image_source === 'link' ? (
                  <input type="text" placeholder="رابط الصورة (مطلوب)" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                ) : (
                  <input type="file" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                )}
                <button onClick={handleAdd} disabled={isUploading} className="w-full bg-blue-600 p-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50">
                  {isUploading ? <Loader2 className="animate-spin" /> : 'إضافة تحليلك/ثريدك'}
                </button>
                <button onClick={() => setIsFormOpen(false)} disabled={isUploading} className="w-full bg-red-600 p-3 rounded-xl text-white disabled:opacity-50">إلغاء</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} imageUrl={selectedImage || ''} />
    </div>
  );
};
