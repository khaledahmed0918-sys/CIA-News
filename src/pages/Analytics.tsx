import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Analysis {
  id: number;
  image_url: string;
  person_name: string;
  message: string;
}

export const Analytics: React.FC = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ person_name: '', message: '', image_source: 'link', image_url: '', file: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get('/api/analyze');
      // Map static data to Analysis interface (ensure id is number for consistency)
      const staticData = analyticsData.map((i, idx) => ({ 
        id: 10000 + idx, // Use a large number to avoid collision
        image_url: i.image, 
        person_name: i.subject, 
        message: i.content 
      }));
      setAnalyses([...staticData, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch analyses, using static data only', error);
      const staticData = analyticsData.map((i, idx) => ({ 
        id: 10000 + idx, 
        image_url: i.image, 
        person_name: i.subject, 
        message: i.content 
      }));
      setAnalyses(staticData);
    }
  };

  const handleAdd = async () => {
    setIsUploading(true);
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

    await axios.post('/api/analyze', { image_url: imageUrl, person_name: formData.person_name, message: formData.message });
    setIsUploading(false);
    setIsFormOpen(false);
    fetchAnalyses();
    setFormData({ person_name: '', message: '', image_source: 'link', image_url: '', file: null });
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
                <div className="w-full h-64 md:h-96 relative cursor-pointer group overflow-hidden" onClick={() => setSelectedImage(item.image_url)}>
                  <img src={item.image_url} alt={item.person_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-blue-200 mb-4">{item.person_name}</h3>
                <p className="text-blue-100/80 leading-loose text-lg text-justify">{item.message}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-xl font-bold text-white">إضافة تحليل/ثريد جديد</h3>
              <input type="text" placeholder="اكتب اسمك" value={formData.person_name} onChange={e => setFormData({...formData, person_name: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
              <textarea placeholder="اكتب تحليلك" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white h-32" />
              <div className="flex gap-2">
                <button onClick={() => setFormData({...formData, image_source: 'link'})} className={`flex-1 p-2 rounded-xl ${formData.image_source === 'link' ? 'bg-blue-600' : 'bg-[#1e293b]'}`}>رابط</button>
                <button onClick={() => setFormData({...formData, image_source: 'upload'})} className={`flex-1 p-2 rounded-xl ${formData.image_source === 'upload' ? 'bg-blue-600' : 'bg-[#1e293b]'}`}>تحميل</button>
              </div>
              {formData.image_source === 'link' ? (
                <input type="text" placeholder="رابط الصورة (اختياري)" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
              ) : (
                <input type="file" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
              )}
              <button onClick={handleAdd} className="w-full bg-blue-600 p-3 rounded-xl text-white flex items-center justify-center gap-2">
                {isUploading ? <Loader2 className="animate-spin" /> : 'إضافة تحليلك/ثريدك'}
              </button>
              <button onClick={() => setIsFormOpen(false)} className="w-full bg-red-600 p-3 rounded-xl text-white">إلغاء</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} imageUrl={selectedImage || ''} />
    </div>
  );
};