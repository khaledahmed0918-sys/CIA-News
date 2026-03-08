import React, { useState, useMemo } from 'react';
import { useStreamerData, Streamer } from '@/hooks/useStreamerData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Wifi, WifiOff, Twitter, Instagram, Youtube, Disc as Discord, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export const Streamers: React.FC = () => {
  const { streamers, loading } = useStreamerData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStreamers = useMemo(() => {
    return streamers.filter(s => 
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [streamers, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-white/10 pb-6">
        <h2 className="text-3xl font-bold text-blue-100 flex items-center gap-3">
          <Users className="text-blue-500" />
          حسابات أعضاء CIA
        </h2>
        
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

      {loading && streamers.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStreamers.map((streamer) => (
            <StreamerCard key={streamer.slug} streamer={streamer} />
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

const StreamerCard: React.FC<{ streamer: Streamer }> = ({ streamer }) => {
  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full group hover:shadow-blue-500/10 transition-all duration-500 border-white/5">
      {/* Banner */}
      <div className="h-32 w-full relative overflow-hidden">
        <img 
          src={streamer.banner} 
          alt={`${streamer.username} banner`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/90" />
        
        {/* Live Status Badge */}
        <div className="absolute top-3 left-3">
          {streamer.isLive ? (
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
          <div className={`p-1 rounded-full ${streamer.isLive ? 'bg-red-500 animate-pulse' : 'bg-[#0f172a] border border-white/10'}`}>
            <img 
              src={streamer.avatar || `https://ui-avatars.com/api/?name=${streamer.username}&background=random`} 
              alt={streamer.username} 
              className="w-20 h-20 rounded-full object-cover border-4 border-[#0f172a] shadow-xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Header Info */}
        <div className="mt-10 mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {streamer.username}
            {streamer.isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
          </h3>
          <p className="text-blue-400/70 text-sm font-mono">@{streamer.slug}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
            <div className="text-xs text-blue-300/50 mb-1">المتابعون</div>
            <div className="font-mono font-bold text-blue-100">
              {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(streamer.followersCount)}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
            <div className="text-xs text-blue-300/50 mb-1">{streamer.isLive ? 'المشاهدون' : 'آخر بث'}</div>
            <div className="font-mono font-bold text-blue-100 text-xs flex items-center justify-center h-full">
              {streamer.isLive ? (
                <span className="text-red-400">{streamer.viewers.toLocaleString()}</span>
              ) : (
                <span className="text-[10px] opacity-70">
                  {formatDistanceToNow(new Date(streamer.lastStream), { addSuffix: true, locale: ar })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div className="bg-blue-500/5 rounded-xl p-3 mb-4 border border-blue-500/10">
          <div className="text-xs text-blue-400 mb-1 font-bold uppercase tracking-wider">
            {streamer.isLive ? 'يبث الآن' : 'آخر عنوان'}
          </div>
          <p className="text-sm text-blue-100 line-clamp-2 leading-relaxed" title={streamer.title}>
            {streamer.title}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/20">
              {streamer.category}
            </span>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2 justify-end">
          {streamer.socials.twitter && (
            <SocialIcon href={streamer.socials.twitter} icon={Twitter} color="hover:text-blue-400" />
          )}
          {streamer.socials.instagram && (
            <SocialIcon href={streamer.socials.instagram} icon={Instagram} color="hover:text-pink-500" />
          )}
          {streamer.socials.youtube && (
            <SocialIcon href={streamer.socials.youtube} icon={Youtube} color="hover:text-red-500" />
          )}
          {streamer.socials.discord && (
            <SocialIcon href={streamer.socials.discord} icon={Discord} color="hover:text-indigo-400" />
          )}
           <a 
            href={`https://kick.com/${streamer.slug}`} 
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

const SocialIcon: React.FC<{ href: string; icon: any; color: string }> = ({ href, icon: Icon, color }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 ${color} transition-all duration-300`}
  >
    <Icon size={16} />
  </a>
);
