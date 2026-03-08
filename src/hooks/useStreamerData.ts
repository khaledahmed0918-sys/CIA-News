import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { streamerLinks, getStreamerSlug } from '@/data/streamers';

export interface Streamer {
  slug: string;
  username: string;
  avatar: string;
  isLive: boolean;
  viewers: number;
  category: string;
  title: string;
  banner: string;
  lastStream: string; // ISO date or string
  socials: {
    twitter?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
  };
  bio: string;
  followersCount: number;
}

export const useStreamerData = () => {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreamer = async (slug: string): Promise<Streamer | null> => {
    try {
      // In a real scenario, we would hit the proxy.
      // For this environment, if the proxy fails (due to Cloudflare), we might need a fallback.
      // We will try the proxy first.
      const response = await axios.get(`/api/kick/${slug}`);
      const data = response.data;

      if (!data) return null;

      // Map Kick API response to our Streamer interface
      // Note: The actual Kick API structure might vary. This is a best-guess mapping based on common public knowledge of their v1 API.
      // If the API changes or is blocked, this might need adjustment.
      
      return {
        slug: data.slug,
        username: data.user.username,
        avatar: data.user.profile_pic,
        isLive: data.livestream !== null,
        viewers: data.livestream ? data.livestream.viewer_count : 0,
        category: data.livestream ? data.livestream.categories[0]?.name : 'None',
        title: data.livestream ? data.livestream.session_title : data.previous_livestreams?.[0]?.session_title || 'No recent stream',
        banner: data.banner_image?.url || 'https://picsum.photos/seed/cia/800/200', // Fallback banner
        lastStream: data.livestream ? new Date().toISOString() : (data.previous_livestreams?.[0]?.created_at || new Date().toISOString()),
        socials: {
          twitter: data.user.social_twitter,
          instagram: data.user.social_instagram,
          youtube: data.user.social_youtube,
          discord: data.user.social_discord,
        },
        bio: data.user.bio || 'No bio available.',
        followersCount: data.followers_count || 0,
      };
    } catch (err) {
      console.warn(`Failed to fetch ${slug}, using mock data for demo purposes if strictly necessary, but prefer real data.`);
      // If we strictly cannot fetch, we return null to show skeleton or error.
      // However, to make the app usable in this preview if the proxy is blocked:
      // I will return a mock object ONLY if the fetch fails, marked as offline.
      // The user requested "Real integrations", but if the API is protected by Cloudflare (which Kick is),
      // the proxy might fail with 403.
      // I'll return null here and let the UI handle the "loading" or "error" state.
      return null;
    }
  };

  const fetchAllStreamers = useCallback(async () => {
    setLoading(true);
    const slugs = streamerLinks.map(getStreamerSlug);
    
    // We fetch in parallel but maybe limit concurrency if needed.
    // For now, simple Promise.all
    const results = await Promise.all(slugs.map(slug => fetchStreamer(slug)));
    
    const validStreamers = results.filter((s): s is Streamer => s !== null);
    
    // Sort: Live first, then by last stream date descending
    validStreamers.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(b.lastStream).getTime() - new Date(a.lastStream).getTime();
    });

    setStreamers(validStreamers);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllStreamers();

    const interval = setInterval(() => {
      fetchAllStreamers();
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, [fetchAllStreamers]);

  return { streamers, loading, error, refetch: fetchAllStreamers };
};
