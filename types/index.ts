import { Types } from 'mongoose';

// ─── User & Auth ────────────────────────────────────────────────────────────

export interface TwitterAccount {
  connected: boolean;
  accessToken: string;       // AES-256 encrypted
  refreshToken: string;      // AES-256 encrypted
  username: string;
  userId: string;
  autoPost: boolean;
}

export interface LinkedInAccount {
  connected: boolean;
  accessToken: string;       // AES-256 encrypted
  personUrn: string;
  displayName: string;
  autoPost: boolean;
}

export interface ThreadsAccount {
  connected: boolean;
  accessToken: string;       // AES-256 encrypted
  userId: string;
  username: string;
  autoPost: boolean;
}

export interface SocialAccounts {
  twitter: TwitterAccount;
  linkedin: LinkedInAccount;
  threads: ThreadsAccount;
}

export interface UserPreferences {
  emailNotifications: boolean;
  defaultCategory: string;
}

export interface IUser {
  _id?: Types.ObjectId | string;
  id?: string;
  name: string;
  email: string;
  image?: string;
  password?: string;          // hashed, only for credentials auth
  emailVerified?: Date | null;
  socialAccounts: SocialAccounts;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface PostSEO {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
  score: number;
}

export interface PostSocialData {
  twitterPostId: string | null;
  linkedinPostId: string | null;
  threadsPostId: string | null;
  autoPosted: boolean;
  customMessages: {
    twitter: string;
    linkedin: string;
    threads: string;
  };
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime: number;
}

export interface PostVersion {
  content: string;
  savedAt: Date;
  savedBy: string;
}

export interface IPost {
  _id?: Types.ObjectId | string;
  id?: string;
  title: string;
  slug: string;
  content: string;           // MDX content
  excerpt: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  status: PostStatus;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  seo: PostSEO;
  social: PostSocialData;
  stats: PostStats;
  versions: PostVersion[];   // last 10 versions
}

// ─── Comments ────────────────────────────────────────────────────────────────

export type CommentStatus = 'pending' | 'approved' | 'spam';

export interface IComment {
  _id?: Types.ObjectId | string;
  id?: string;
  postId: string;
  postTitle: string;
  parentId?: string | null;   // for nested replies
  authorName: string;
  authorEmail: string;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  ipAddress?: string;
  aiSpamScore: number;        // 0-1
}

// ─── Subscribers ─────────────────────────────────────────────────────────────

export type SubscriberStatus = 'active' | 'unsubscribed';

export interface ISubscriber {
  _id?: Types.ObjectId | string;
  id?: string;
  email: string;
  name: string;
  subscribedAt: Date;
  status: SubscriberStatus;
  tags: string[];
  unsubscribeToken: string;
}

// ─── Social Queue ─────────────────────────────────────────────────────────────

export type SocialQueueStatus = 'pending' | 'posted' | 'failed';

export interface SocialQueueResult {
  success: boolean;
  postId: string;
  error: string;
}

export interface ISocialQueue {
  _id?: Types.ObjectId | string;
  id?: string;
  postId: string;
  userId: string;
  platforms: string[];
  messages: {
    twitter: string;
    linkedin: string;
    threads: string;
  };
  status: SocialQueueStatus;
  scheduledFor: Date;
  postedAt: Date | null;
  results: {
    twitter: SocialQueueResult;
    linkedin: SocialQueueResult;
    threads: SocialQueueResult;
  };
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export type AITextMode = 'rewrite' | 'expand' | 'shorten' | 'grammar';

export interface AIGenerateRequest {
  title: string;
  outline?: string;
}

export interface AIImproveRequest {
  text: string;
  mode: AITextMode;
}

export interface AISOcialMessagesRequest {
  title: string;
  excerpt: string;
  url: string;
}

export interface AISocialMessages {
  twitter: string;
  linkedin: string;
  threads: string;
}

export interface SEOAnalysis {
  score: number;
  breakdown: {
    titleLength: { score: number; max: number; message: string };
    metaDescription: { score: number; max: number; message: string };
    keywordInTitle: { score: number; max: number; message: string };
    keywordInFirstParagraph: { score: number; max: number; message: string };
    imageAltTexts: { score: number; max: number; message: string };
    internalLinks: { score: number; max: number; message: string };
    postLength: { score: number; max: number; message: string };
  };
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Dashboard Analytics ──────────────────────────────────────────────────────

export interface DailyView {
  date: string;
  views: number;
}

export interface AnalyticsOverview {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalSubscribers: number;
  dailyViews: DailyView[];
  topPosts: Pick<IPost, 'id' | 'title' | 'slug' | 'stats'>[];
  socialReach: {
    twitter: number;
    linkedin: number;
    threads: number;
    total: number;
  };
}

// ─── NextAuth Session Extension ───────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
  interface User {
    id: string;
  }
}

