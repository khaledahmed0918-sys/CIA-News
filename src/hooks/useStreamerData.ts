import { useState, useEffect, useCallback } from 'react';
import { streamerLinks, getStreamerSlug } from '@/data/streamers';
import { fetchKickChannel } from '@/services/kickService';
import type { Channel } from '@/types';

export const useStreamerData = () => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({});

  const fetchAllStreamers = useCallback(async () => {
    if (streamers.length === 0) setLoading(true);
    
    const slugs = streamerLinks.map(getStreamerSlug);
    
    // Fetch in batches
    const BATCH_SIZE = 5;
    const results: Channel[] = [];
    
    for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
      const batch = slugs.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(slug => fetchKickChannel(slug, retryCounts[slug] || 0)));
      results.push(...batchResults);
    }
    
    // Sort: Live first, then by last stream date descending
    results.sort((a, b) => {
      if (a.is_live && !b.is_live) return -1;
      if (!a.is_live && b.is_live) return 1;
      
      const dateA = a.last_stream_start_time ? new Date(a.last_stream_start_time).getTime() : 0;
      const dateB = b.last_stream_start_time ? new Date(b.last_stream_start_time).getTime() : 0;
      return dateB - dateA;
    });

    setStreamers(results);
    setLoading(false);
  }, [streamers.length, retryCounts]);

  const retryStreamer = async (username: string) => {
    // Increment retry count for this user
    setRetryCounts(prev => ({
      ...prev,
      [username]: (prev[username] || 0) + 1
    }));

    // Optimistically update to loading state if you wanted, but here we just fetch
    const updatedChannel = await fetchKickChannel(username, (retryCounts[username] || 0) + 1);
    
    setStreamers(prev => prev.map(s => s.username === username ? updatedChannel : s));
  };

  useEffect(() => {
    fetchAllStreamers();

    const interval = setInterval(() => {
      fetchAllStreamers();
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, [fetchAllStreamers]);

  return { streamers, loading, retryStreamer };
};


