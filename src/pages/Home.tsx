import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { BarChart2, Users, FileText, AlertTriangle, Info, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'التحليلات والثريدات',
    description: 'تحليلات عميقة وشاملة عن قضايا وشخصيات الوكالة.',
    icon: BarChart2,
    path: '/analytics',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
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
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mb-4"
        >
          CIA News
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-blue-200/60 text-lg max-w-2xl mx-auto"
        >
          بوابتك الأولى لمعرفة كل ما يدور في أروقة وكالة الاستخبارات المركزية
        </motion.p>
      </div>

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
