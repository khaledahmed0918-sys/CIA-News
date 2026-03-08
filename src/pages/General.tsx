import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { generalInfo } from '@/data/general';
import { Shield, Globe, Lock, Eye } from 'lucide-react';

export const General: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-100 mb-6">معلومات عامة</h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <GlassCard className="p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <Shield size={120} />
          </div>
          
          <h2 className="text-3xl font-bold text-blue-200 mb-6 flex items-center gap-3">
            <Shield className="text-blue-500" />
            {generalInfo.title}
          </h2>
          
          <p className="text-blue-100/80 text-lg leading-loose text-justify">
            {generalInfo.content}
          </p>
        </GlassCard>

        <div className="grid grid-cols-1 gap-6">
          <GlassCard className="p-6 flex items-start gap-4 hover:bg-blue-500/10 transition-colors">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">حماية الولاية</h3>
              <p className="text-blue-200/60">الدفاع عن أمن واستقرار المنطقة ضد أي تهديدات خارجية أو داخلية.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 hover:bg-blue-500/10 transition-colors">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">رصد وتحليل</h3>
              <p className="text-blue-200/60">مراقبة التحركات المشبوهة وجمع المعلومات الاستخباراتية بدقة عالية.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 hover:bg-blue-500/10 transition-colors">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">سرية تامة</h3>
              <p className="text-blue-200/60">العمل ضمن بروتوكولات أمنية صارمة لضمان سرية العمليات والمعلومات.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
