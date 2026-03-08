import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Modal } from '@/components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import { analyticsData } from '@/data/analytics';
import { casesData } from '@/data/cases';
import { wantedData } from '@/data/wanted';

interface Character {
  id: number;
  image_url: string;
  person_name: string;
  character_name: string;
}

export const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ person_name: '', character_name: '', image_source: 'link', image_url: '', files: [] as File[] });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get('/api/characters');
      setCharacters(response.data);
    } catch (error) {
      console.error('Failed to fetch characters', error);
    }
  };

  const filteredCharacters = characters.filter(c => 
    c.person_name.toLowerCase().includes(search.toLowerCase()) || 
    c.character_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!formData.person_name || !formData.character_name) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      let imageUrls: string[] = [];
      if (formData.image_source === 'link') {
        if (!formData.image_url) throw new Error('يرجى إدخال رابط الصورة');
        imageUrls = [formData.image_url];
      } else {
        if (formData.files.length === 0) throw new Error('يرجى اختيار صورة');
        // Upload files to ImgBB
        for (const file of formData.files) {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          const response = await axios.post('/api/upload-image', { image: base64.split(',')[1] });
          imageUrls.push(response.data.data.url);
          setUploadProgress(prev => prev + (80 / formData.files.length));
        }
      }

      for (const url of imageUrls) {
        await axios.post('/api/characters', { image_url: url, person_name: formData.person_name, character_name: formData.character_name });
      }

      setUploadProgress(100);
      setIsFormOpen(false);
      fetchCharacters();
      setFormData({ person_name: '', character_name: '', image_source: 'link', image_url: '', files: [] });
    } catch (error: any) {
      console.error('Upload failed', error);
      alert(error.message || 'حدث خطأ أثناء الإضافة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-100">معرض الصور</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
            <input 
              type="text" 
              placeholder="بحث..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0f172a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-blue-500">
            <Plus size={20} /> إضافة صورة
          </button>
        </div>
      </div>
      
      {filteredCharacters.length === 0 ? (
        <div className="text-center text-blue-400 py-20">لا توجد صور حالياً</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((c) => (
            <GlassCard key={c.id} className="p-2 group overflow-hidden">
              <div className="relative overflow-hidden rounded-xl cursor-pointer aspect-[3/4]" onClick={() => setSelectedImage(c.image_url)}>
                <img src={c.image_url} alt={c.character_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{c.character_name}</h3>
                  <p className="text-blue-400 text-sm">{c.person_name}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFormOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] backdrop-blur-sm bg-black/15 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl w-full max-w-lg space-y-4 shadow-2xl my-auto">
                <h3 className="text-xl font-bold text-white">إضافة صورة جديدة</h3>
                <input type="text" placeholder="ادخل اسمك" value={formData.person_name} onChange={e => setFormData({...formData, person_name: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                <input type="text" placeholder="اكتب اسم الشخصية" value={formData.character_name} onChange={e => setFormData({...formData, character_name: e.target.value})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                <div className="flex gap-2">
                  <button onClick={() => setFormData({...formData, image_source: 'link'})} className={`flex-1 p-2 rounded-xl ${formData.image_source === 'link' ? 'bg-blue-600' : 'bg-[#1e293b]'}`}>رابط</button>
                  <button onClick={() => setFormData({...formData, image_source: 'upload'})} className={`flex-1 p-2 rounded-xl ${formData.image_source === 'upload' ? 'bg-blue-600' : 'bg-[#1e293b]'}`}>تحميل</button>
                </div>
                {formData.image_source === 'link' ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="رابط الصورة" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="flex-1 bg-[#1e293b] p-3 rounded-xl text-white" />
                  </div>
                ) : (
                  <input type="file" multiple onChange={e => setFormData({...formData, files: Array.from(e.target.files || [])})} className="w-full bg-[#1e293b] p-3 rounded-xl text-white" />
                )}
                <button onClick={handleAdd} disabled={isUploading} className="w-full bg-blue-600 p-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50">
                  {isUploading ? <><Loader2 className="animate-spin" /> {Math.round(uploadProgress)}%</> : 'إضافة الصور/ة'}
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
