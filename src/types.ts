export interface Channel {
  username: string;
  display_name: string;
  profile_pic: string;
  is_live: boolean;
  live_title: string | null;
  viewer_count: number | null;
  live_since: string | null;
  last_stream_start_time: string | null;
  live_url: string;
  profile_url: string;
  error?: boolean;
  last_checked_at: string;
  bio: string | null;
  followers_count: number | null;
  banner_image: string | null;
  live_category: string | null;
  social_links: {
    twitter?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
    tiktok?: string;
    [key: string]: string | undefined;
  };
  isLoading?: boolean;
}

export interface KickApiResponse {
  user: {
    username: string;
    profile_pic: string;
    bio: string;
    twitter: string;
    instagram: string;
    youtube: string;
    discord: string;
    tiktok: string;
    followers_count: number;
  };
  livestream: {
    session_title: string;
    viewer_count: number;
    start_time: string;
    category: {
      name: string;
    };
  } | null;
  previous_livestreams: {
    start_time: string;
    session_title: string;
    created_at: string;
  }[];
  followers_count: number;
  banner_image: {
    url: string;
  };
}
