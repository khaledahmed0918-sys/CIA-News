import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { BarChart2, Users, FileText, AlertTriangle, Info, Image as ImageIcon, TableProperties } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'الجدول',
    description: 'سجل بيانات وكالة الاستخبارات المركزية.',
    icon: TableProperties,
    path: '/schedule',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'التحليلات والثريدات',
    description: 'تحليلات عميقة وشاملة عن قضايا وشخصيات الوكالة.',
    icon: BarChart2,
    path: '/analytics',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  },
  {
    title: 'حسابات أعضاء CIA',
    description: 'متابعة حية ومباشرة لجميع أعضاء الوكالة ونشاطاتهم.',
    icon: Users,
    path: '/streamers',
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  {
    title: 'القضايا',
    description: 'أرشيف كامل لأهم القضايا والملفات السرية.',
    icon: FileText,
    path: '/cases',
    color: 'text-red-400',
    bg: 'bg-red-500/10'
  },
  {
    title: 'المطلوبين',
    description: 'قائمة المطلوبين للعدالة وأخطر المجرمين.',
    icon: AlertTriangle,
    path: '/wanted',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10'
  },
  {
    title: 'معلومات عامة',
    description: 'كل ما تحتاج معرفته عن وكالة الاستخبارات المركزية.',
    icon: Info,
    path: '/general',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    title: 'صور الشخصيات',
    description: 'معرض صور حصري لشخصيات الوكالة.',
    icon: ImageIcon,
    path: '/characters',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  }
];

export const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative w-full rounded-3xl overflow-hidden mb-12 flex flex-col items-center justify-center py-24 px-4 border border-white/5 bg-slate-900/20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-20 transform-gpu"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/QdnfpfkC/received-858179620603677.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(30%) contrast(110%)'
          }}
        />
        
        {/* Gradient Overlays for blending */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-950/30 to-transparent mix-blend-overlay" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          {/* Logo Image */}
          <motion.img
            src="https://i.postimg.cc/d18NsWjp/IMG-9068.jpg"
            alt="CIA News Logo"
            className="w-32 h-32 md:w-48 md:h-48 rounded-full mb-6 object-cover shadow-[0_0_30px_rgba(59,130,246,0.5)] border-2 border-blue-500/30"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Breathing Logo/Text */}
          <motion.h1 
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.85, 1, 0.85],
              textShadow: [
                "0 0 15px rgba(59, 130, 246, 0.4)",
                "0 0 30px rgba(59, 130, 246, 0.8)",
                "0 0 15px rgba(59, 130, 246, 0.4)"
              ]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider"
          >
            CIA News
          </motion.h1>

          {/* Hashtag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-400 font-bold text-xl md:text-2xl mb-6 tracking-widest drop-shadow-md"
          >
            #CIA_NEWS
          </motion.div>

          {/* Subtitle with lines */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 w-full max-w-3xl px-4"
          >
            {/* Left Line */}
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-blue-500/20 to-blue-500/80 rounded-full" />
            
            {/* Text */}
            <p className="text-blue-100/90 text-sm md:text-lg font-semibold tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-sm">
              Central Intelligence Agency's Voice
            </p>

            {/* Right Line */}
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-blue-500/20 to-blue-500/80 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link to={section.path} key={section.path}>
            <GlassCard 
              className="h-full p-6 flex flex-col items-start text-right group transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20"
            >
              <div className={`w-16 h-16 rounded-2xl ${section.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-6`}>
                <section.icon size={32} className={section.color} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
              <p className="text-blue-200/50 text-sm leading-relaxed">{section.description}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
