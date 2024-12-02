interface BannerImage {
  url: string;
}

interface OfflineBannerImage {
  src: string;
  srcset: string;
}

interface RecentCategoryBanner {
  responsive: string;
  url: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

interface RecentCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  tags: string[];
  description: string | null;
  deleted_at: string | null;
  viewers: number;
  is_mature: boolean;
  banner: RecentCategoryBanner;
  category: Category;
}

interface User {
  id: number;
  username: string;
  agreed_to_terms: boolean;
  email_verified_at: string;
  bio: string;
  country: string;
  state: string;
  city: string;
  instagram: string;
  twitter: string;
  youtube: string;
  discord: string;
  tiktok: string;
  facebook: string;
  profile_pic: string;
}

interface Chatroom {
  id: number;
  chatable_type: string;
  channel_id: number;
  created_at: string;
  updated_at: string;
  chat_mode_old: string;
  chat_mode: string;
  slow_mode: boolean;
  chatable_id: number;
  followers_mode: boolean;
  subscribers_mode: boolean;
  emotes_mode: boolean;
  message_interval: number;
  following_min_duration: number;
}

export interface Channel {
  id: number;
  user_id: number;
  slug: string;
  is_banned: boolean;
  playback_url: string;
  vod_enabled: boolean;
  subscription_enabled: boolean;
  is_affiliate: boolean;
  followers_count: number;
  subscriber_badges: Array;
  banner_image: BannerImage;
  livestream: boolean;
  role: string | null;
  muted: boolean;
  follower_badges: Array;
  offline_banner_image: OfflineBannerImage;
  verified: boolean;
  recent_categories: RecentCategory[];
  can_host: boolean;
  user: User;
  chatroom: Chatroom;
}
