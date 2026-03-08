import { useState, useEffect, useCallback } from 'react';
import { streamerLinks, getStreamerSlug } from '@/data/streamers';
import { fetchKickChannel } from '@/services/kickService';
import type { Channel } from '@/types';

export const useStreamerData = () => {
  const [streamers, setStreamers] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadData = async () => {
      if (streamers.length === 0) setLoading(true);
      
      const slugs = streamerLinks.map(getStreamerSlug);
      const BATCH_SIZE = 5;
      const results: Channel[] = [];
      
      try {
        for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
          if (signal.aborted) return;
          const batch = slugs.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(
            batch.map(slug => fetchKickChannel(slug, retryCounts[slug] || 0, signal))
          );
          results.push(...batchResults);
        }
        
        if (signal.aborted) return;

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
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch streamers', error);
          setLoading(false);
        }
      }
    };

    loadData();

    const interval = setInterval(loadData, 3 * 60 * 1000); // 3 minutes

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [retryCounts]);

  const retryStreamer = (username: string) => {
    setRetryCounts(prev => ({
      ...prev,
      [username]: (prev[username] || 0) + 1
    }));
  };

  return { streamers, loading, retryStreamer };
};


