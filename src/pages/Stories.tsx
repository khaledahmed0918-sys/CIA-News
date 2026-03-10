import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, BookOpen, ChevronDown, ChevronUp, User, Link as LinkIcon } from 'lucide-react';
import { storiesData, Story } from '@/data/stories';

export const Stories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredStories = storiesData.filter(story => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = story.title?.toLowerCase().includes(searchLower);
    const nameMatch = story.names?.some(name => name.toLowerCase().includes(searchLower));
    return titleMatch || nameMatch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-100">قصص الشخصيات</h2>
            <p className="text-blue-300/60 text-sm mt-1">سجلات وحكايات أعضاء الوكالة</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400/50" />
          </div>
          <input
            type="text"
            placeholder="بحث بالاسم أو العنوان..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-blue-100 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-300/50">
            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
            <p>لا توجد قصص مطابقة للبحث</p>
          </div>
        ) : (
          filteredStories.map((story) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              isExpanded={expandedId === story.id} 
              onToggle={() => toggleExpand(story.id)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

const StoryCard: React.FC<{ story: Story; isExpanded: boolean; onToggle: () => void }> = ({ story, isExpanded, onToggle }) => {
  return (
    <GlassCard 
      className="overflow-hidden border border-white/10 transition-all duration-300 hover:border-blue-500/30 cursor-pointer"
      onClick={onToggle}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Main Image Preview (if any) */}
          {story.images && story.images.length > 0 && !isExpanded && (
            <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden border border-white/10">
              <img 
                src={story.images[0]} 
                alt={story.title || story.names?.[0] || 'Story Image'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Preview */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {story.title && (
                <h3 className="text-2xl font-bold text-blue-100 mb-2">{story.title}</h3>
              )}
              
              {story.names && story.names.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.names.map((name, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded-full border border-blue-500/20">
                      <User className="w-3.5 h-3.5" />
                      {name}
                    </span>
                  ))}
                </div>
              )}

              {story.content && !isExpanded && (
                <p className="text-blue-100/70 line-clamp-3 leading-relaxed">
                  {story.content}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end mt-4 text-blue-400/70">
              <span className="text-sm font-medium flex items-center gap-1">
                {isExpanded ? 'إخفاء القصة' : 'قراءة القصة كاملة'}
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
              <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-white/10 space-y-6">
                
                {/* Full Text */}
                {story.content && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-blue-50/90 leading-loose whitespace-pre-wrap text-lg"
                  >
                    {story.content}
                  </motion.div>
                )}

                {/* All Images */}
                {story.images && story.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4"
                  >
                    {story.images.map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                        <img src={img} alt={`Story Image ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Social Links */}
                {story.socialLinks && story.socialLinks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-wrap gap-3 pt-4 border-t border-white/5"
                  >
                    {story.socialLinks.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-blue-200 rounded-lg border border-white/10 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {link.platform}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
