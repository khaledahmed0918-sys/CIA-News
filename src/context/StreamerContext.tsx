import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Channel } from '@/types';
import { fetchKickChannel } from '@/services/kickService';
import { streamersList } from '@/data/streamers';

interface StreamerContextType {
  streamers: Channel[];
  loading: boolean;
  refreshStreamers: (force?: boolean) => Promise<void>;
  retryStreamer: (username: string) => Promise<void>;
}

const StreamerContext = createContext<StreamerContextType | undefined>(undefined);

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

export const StreamerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchStreamerData = useCallback(async (username: string) => {
    try {
      return await fetchKickChannel(username);
    } catch (error) {
      console.error(`Error fetching ${username}:`, error);
      return {
        username,
        display_name: username,
        is_live: false,
        error: true,
        isLoading: false,
        profile_pic: '',
        live_url: `https://kick.com/${username}`,
        profile_url: `https://kick.com/${username}`,
        social_links: {},
        last_checked_at: new Date().toISOString(),
      } as Channel;
    }
  }, []);

  const refreshStreamers = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && streamers.length > 0 && now - lastUpdated < CACHE_DURATION) {
      return;
    }

    setLoading(true);
    
    // Initial load with skeletons if empty
    if (streamers.length === 0) {
      // Optional: set initial skeleton state if needed, but loading=true handles it
    }

    try {
      // Fetch all in parallel
      const results = await Promise.all(
        streamersList.map(username => fetchStreamerData(username))
      );
      
      setStreamers(results);
      setLastUpdated(now);
    } catch (error) {
      console.error("Failed to refresh streamers", error);
    } finally {
      setLoading(false);
    }
  }, [lastUpdated, streamers.length, fetchStreamerData]);

  const retryStreamer = useCallback(async (username: string) => {
    setStreamers(prev => prev.map(s => 
      s.username === username ? { ...s, isLoading: true, error: false } : s
    ));

    const newData = await fetchStreamerData(username);

    setStreamers(prev => prev.map(s => 
      s.username === username ? newData : s
    ));
  }, [fetchStreamerData]);

  // Initial fetch
  useEffect(() => {
    refreshStreamers();
  }, [refreshStreamers]);

  return (
    <StreamerContext.Provider value={{ streamers, loading, refreshStreamers, retryStreamer }}>
      {children}
    </StreamerContext.Provider>
  );
};

export const useStreamerContext = () => {
  const context = useContext(StreamerContext);
  if (context === undefined) {
    throw new Error('useStreamerContext must be used within a StreamerProvider');
  }
  return context;
};
