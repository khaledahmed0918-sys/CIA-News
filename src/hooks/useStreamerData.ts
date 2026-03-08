import { useState, useEffect, useCallback } from 'react';
import { streamerLinks, getStreamerSlug } from '@/data/streamers';
import { fetchKickChannel } from '@/services/kickService';
import type { Channel } from '@/types';

export const useStreamerData = () => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStreamers = useCallback(async () => {
    // Don't set loading to true on background refreshes to avoid UI flicker
    if (streamers.length === 0) setLoading(true);
    
    const slugs = streamerLinks.map(getStreamerSlug);
    
    // Fetch in batches to avoid overwhelming the proxy/browser
    const BATCH_SIZE = 5;
    const results: Channel[] = [];
    
    for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
      const batch = slugs.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(slug => fetchKickChannel(slug)));
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
  }, [streamers.length]);

  useEffect(() => {
    fetchAllStreamers();

    const interval = setInterval(() => {
      fetchAllStreamers();
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, [fetchAllStreamers]);

  return { streamers, loading, error, refetch: fetchAllStreamers };
};

