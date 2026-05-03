import mongoose, { Schema, model, models, Document } from 'mongoose';
import { IUser, IPost, IComment, ISubscriber, ISocialQueue } from '@/types';

// ─── User Model ───────────────────────────────────────────────────────────────

const SocialAccountSchema = new Schema({
  connected: { type: Boolean, default: false },
  accessToken: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  personUrn: { type: String, default: '' },
  displayName: { type: String, default: '' },
  username: { type: String, default: '' },
  userId: { type: String, default: '' },
  autoPost: { type: Boolean, default: false },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, default: '' },
  password: { type: String, select: false },
  emailVerified: { type: Date, default: null },
  socialAccounts: {
    twitter: { type: SocialAccountSchema, default: () => ({}) },
    linkedin: { type: SocialAccountSchema, default: () => ({}) },
    threads: { type: SocialAccountSchema, default: () => ({}) },
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    defaultCategory: { type: String, default: 'General' },
  },
}, { timestamps: true });

export const User = models.User || model<IUser>('User', UserSchema);

// ─── Post Model ───────────────────────────────────────────────────────────────

const PostVersionSchema = new Schema({
  content: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
  savedBy: { type: String, required: true },
}, { _id: false });

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled', 'archived'],
    default: 'draft',
  },
  publishedAt: { type: Date, default: null },
  scheduledAt: { type: Date, default: null },
  tags: [{ type: String }],
  category: { type: String, default: 'General' },
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    focusKeyword: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  social: {
    twitterPostId: { type: String, default: null },
    linkedinPostId: { type: String, default: null },
    threadsPostId: { type: String, default: null },
    autoPosted: { type: Boolean, default: false },
    customMessages: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      threads: { type: String, default: '' },
    },
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    readTime: { type: Number, default: 0 },
  },
  versions: { type: [PostVersionSchema], default: [] },
}, { timestamps: true });

PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, scheduledAt: 1 });
PostSchema.index({ authorId: 1, status: 1 });

export const Post = models.Post || model<IPost>('Post', PostSchema);

// ─── Comment Model ────────────────────────────────────────────────────────────

const CommentSchema = new Schema<IComment>({
  postId: { type: String, required: true, index: true },
  postTitle: { type: String, required: true },
  parentId: { type: String, default: null },
  authorName: { type: String, required: true },
  authorEmail: { type: String, required: true, lowercase: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'spam'],
    default: 'pending',
  },
  ipAddress: { type: String, default: '' },
  aiSpamScore: { type: Number, default: 0, min: 0, max: 1 },
}, { timestamps: true });

export const Comment = models.Comment || model<IComment>('Comment', CommentSchema);

// ─── Subscriber Model ─────────────────────────────────────────────────────────

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  subscribedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
  tags: [{ type: String }],
  unsubscribeToken: { type: String, required: true },
}, { timestamps: true });

export const Subscriber = models.Subscriber || model<ISubscriber>('Subscriber', SubscriberSchema);

// ─── Social Queue Model ───────────────────────────────────────────────────────

const QueueResultSchema = new Schema({
  success: { type: Boolean, default: false },
  postId: { type: String, default: '' },
  error: { type: String, default: '' },
}, { _id: false });

const SocialQueueSchema = new Schema<ISocialQueue>({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  platforms: [{ type: String }],
  messages: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    threads: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['pending', 'posted', 'failed'],
    default: 'pending',
  },
  scheduledFor: { type: Date, required: true },
  postedAt: { type: Date, default: null },
  results: {
    twitter: { type: QueueResultSchema, default: () => ({}) },
    linkedin: { type: QueueResultSchema, default: () => ({}) },
    threads: { type: QueueResultSchema, default: () => ({}) },
  },
}, { timestamps: true });

export const SocialQueue = models.SocialQueue || model<ISocialQueue>('SocialQueue', SocialQueueSchema);

// ─── NextAuth Account/Session models (required by @auth/mongodb-adapter) ──────

const AccountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: String,
  provider: String,
  providerAccountId: String,
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
});

export const Account = models.Account || model('Account', AccountSchema);

const SessionSchema = new Schema({
  sessionToken: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  expires: Date,
});

export const Session = models.Session || model('Session', SessionSchema);

const VerificationTokenSchema = new Schema({
  identifier: String,
  token: { type: String, unique: true },
  expires: Date,
});

export const VerificationToken = models.VerificationToken || model('VerificationToken', VerificationTokenSchema);
