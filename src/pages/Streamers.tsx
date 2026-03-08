import React, { useState, useMemo } from 'react';
import { useStreamerData } from '@/hooks/useStreamerData';
import type { Channel } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Wifi, WifiOff, Twitter, Instagram, Youtube, Users, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const DiscordIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor" className={className}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a67.58,67.58,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
  </svg>
);

const isValidSocialLink = (link: string | undefined) => {
  if (!link) return false;
  const trimmed = link.trim();
  if (trimmed === '') return false;
  if (trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') return false;
  return true;
};

export const Streamers: React.FC = () => {
  const { streamers, loading, retryStreamer } = useStreamerData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isReloadingAll, setIsReloadingAll] = useState(false);

  const filteredStreamers = useMemo(() => {
    let result = streamers.filter(s => 
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.live_title && s.live_title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      if (a.is_live && !b.is_live) return -1;
      if (!a.is_live && b.is_live) return 1;
      
      if (a.is_live && b.is_live) {
        return (b.viewer_count || 0) - (a.viewer_count || 0);
      }
      
      const timeA = a.last_stream_start_time ? new Date(a.last_stream_start_time).getTime() : 0;
      const timeB = b.last_stream_start_time ? new Date(b.last_stream_start_time).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [streamers, searchQuery]);

  const failedStreamers = useMemo(() => streamers.filter(s => s.error), [streamers]);
  const failedCount = failedStreamers.length;

  const handleReloadAllFailed = async () => {
    setIsReloadingAll(true);
    await Promise.all(failedStreamers.map(s => retryStreamer(s.username)));
    setIsReloadingAll(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/10 pb-6">
        <h2 className="text-3xl font-bold text-blue-100 flex items-center gap-3">
          <Users className="text-blue-500" />
          حسابات أعضاء CIA
        </h2>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {failedCount > 0 && (
            <button
              onClick={handleReloadAllFailed}
              disabled={isReloadingAll}
              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 px-4 py-3 rounded-xl flex items-center gap-2 transition-all font-bold whitespace-nowrap disabled:opacity-50"
            >
              <RefreshCw size={18} className={isReloadingAll ? 'animate-spin' : ''} />
              إعادة تحميل ({failedCount})
            </button>
          )}
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400/50" size={20} />
            <input
              type="text"
              placeholder="ابحث عن عضو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-blue-400/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {loading && streamers.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} className="h-[400px] p-0 overflow-hidden flex flex-col">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4 -mt-12">
                  <Skeleton className="w-20 h-20 rounded-full border-4 border-[#0f172a]" />
                  <div className="flex-1 pt-8">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-auto flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStreamers.map((streamer) => (
            <StreamerCard 
              key={streamer.username} 
              streamer={streamer} 
              onRetry={() => retryStreamer(streamer.username)}
            />
          ))}
          
          {filteredStreamers.length === 0 && (
            <div className="col-span-full text-center py-20 text-blue-200/50">
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StreamerCard: React.FC<{ streamer: Channel; onRetry: () => void }> = ({ streamer, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setIsRetrying(false);
  };

  if (streamer.isLoading) {
    return (
      <GlassCard className="h-[400px] p-0 overflow-hidden flex flex-col border-white/5">
        <Skeleton className="h-32 w-full rounded-none" />
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 -mt-12">
            <Skeleton className="w-20 h-20 rounded-full border-4 border-[#0f172a]" />
            <div className="flex-1 pt-8">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-auto flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (streamer.error) {
    return (
      <GlassCard className="p-0 overflow-hidden flex flex-col h-[400px] items-center justify-center group hover:shadow-red-500/10 transition-all duration-500 border-red-500/20 bg-red-500/5">
        <div className="text-center p-6 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-2">
            <WifiOff className="text-red-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">@{streamer.username}</h3>
          <p className="text-red-400/70 text-sm mb-4">فشل في جلب البيانات</p>
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'جاري التحميل...' : 'إعادة تحميل'}
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full group hover:shadow-blue-500/10 transition-all duration-500 border-white/5">
      {/* Banner */}
      <div className="h-32 w-full relative overflow-hidden">
        <img 
          src={streamer.banner_image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='} 
          alt={`${streamer.username} banner`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90" />
        
        {/* Live Status Badge */}
        <div className="absolute top-3 left-3">
          {streamer.is_live ? (
            <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Wifi size={14} />
              LIVE
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
              <WifiOff size={14} />
              OFFLINE
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col relative">
        {/* Avatar */}
        <div className="absolute -top-12 right-5">
          <div className={`p-1 rounded-full ${streamer.is_live ? 'bg-red-500 animate-pulse' : 'bg-[#0f172a] border border-white/10'}`}>
            <img 
              src={streamer.profile_pic || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='} 
              alt={streamer.username} 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#0f172a] shadow-xl"
            />
          </div>
        </div>

        {/* Header Info */}
        <div className="mt-10 mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {streamer.display_name}
            {streamer.is_live && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
          </h3>
          <p className="text-blue-400/70 text-sm font-mono">@{streamer.username}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
            <div className="text-xs text-blue-300/50 mb-1">المتابعون</div>
            <div className="font-mono font-bold text-blue-100">
              {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(streamer.followers_count || 0)}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5 flex flex-col justify-center">
            <div className="text-xs text-blue-300/50 mb-1">{streamer.is_live ? 'المشاهدون' : 'آخر بث'}</div>
            <div className="font-mono font-bold text-blue-100 text-xs flex items-center justify-center">
              {streamer.is_live ? (
                <span className="text-red-400">{streamer.viewer_count?.toLocaleString()}</span>
              ) : (
                <span className="text-[10px] leading-tight opacity-70 whitespace-nowrap">
                  {streamer.last_stream_start_time 
                    ? formatDistanceToNow(new Date(streamer.last_stream_start_time), { addSuffix: true, locale: ar })
                    : 'غير متوفر'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div className="bg-blue-500/5 rounded-xl p-3 mb-4 border border-blue-500/10">
          <div className="text-xs text-blue-400 mb-1 font-bold uppercase tracking-wider">
            {streamer.is_live ? 'يبث الآن' : 'النبذة/البايو'}
          </div>
          <p className="text-sm text-blue-100 line-clamp-2 leading-relaxed" title={streamer.live_title || ''}>
            {streamer.live_title || streamer.bio || 'لا يوجد نبذة/بايو'}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/20">
              {streamer.live_category || 'General'}
            </span>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2 justify-end flex-wrap">
          {isValidSocialLink(streamer.social_links.twitter) && (
            <SocialIcon href={streamer.social_links.twitter} icon={Twitter} className="text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" />
          )}
          {isValidSocialLink(streamer.social_links.instagram) && (
            <SocialIcon href={streamer.social_links.instagram} icon={Instagram} className="text-pink-400 bg-pink-500/10 hover:bg-pink-500/20" />
          )}
          {isValidSocialLink(streamer.social_links.youtube) && (
            <SocialIcon href={streamer.social_links.youtube} icon={Youtube} className="text-red-400 bg-red-500/10 hover:bg-red-500/20" />
          )}
          {isValidSocialLink(streamer.social_links.discord) && (
            <SocialIcon href={streamer.social_links.discord} icon={DiscordIcon} className="text-[#5865F2] bg-[#5865F2]/10 hover:bg-[#5865F2]/20" />
          )}
          {isValidSocialLink(streamer.social_links.tiktok) && (
            <SocialIcon href={streamer.social_links.tiktok} icon={({size, className}) => (
               <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            )} className="text-pink-400 bg-pink-500/10 hover:bg-pink-500/20" />
          )}
           <a 
            href={`https://kick.com/${streamer.username}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            KICK
          </a>
        </div>
      </div>
    </GlassCard>
  );
};

const SocialIcon: React.FC<{ href: string; icon: any; className: string }> = ({ href, icon: Icon, className }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`p-2 rounded-lg transition-all duration-300 ${className}`}
  >
    <Icon size={16} />
  </a>
);
