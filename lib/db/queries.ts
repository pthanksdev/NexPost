import connectDB from '@/lib/db/connect';
import { Post, Comment, Subscriber, User, SocialQueue } from '@/lib/db/models';
import { IPost, IComment, ISubscriber, IUser, ISocialQueue, PostVersion } from '@/types';
import { generateSlug, calculateReadTime, generateExcerpt } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// POSTS
// ═══════════════════════════════════════════════════════════════════════════

export async function createPost(data: Partial<IPost>): Promise<IPost> {
  await connectDB();
  const slug = generateSlug(data.title || 'untitled');
  const existing = await Post.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const post = await Post.create({
    ...data,
    slug: finalSlug,
    stats: {
      views: 0, likes: 0, comments: 0, shares: 0,
      readTime: calculateReadTime(data.content || ''),
    },
    seo: {
      metaTitle: '', metaDescription: '', focusKeyword: '',
      canonicalUrl: '', ogImage: '', score: 0,
      ...data.seo,
    },
    social: {
      twitterPostId: null, linkedinPostId: null, threadsPostId: null,
      autoPosted: false,
      customMessages: { twitter: '', linkedin: '', threads: '' },
      ...data.social,
    },
    versions: [],
  });

  return post.toObject();
}

export async function updatePost(id: string, data: Partial<IPost>): Promise<IPost | null> {
  await connectDB();
  if (data.content) {
    data.stats = { ...(data.stats || {}), readTime: calculateReadTime(data.content) } as IPost['stats'];
  }
  const post = await Post.findByIdAndUpdate(id, { $set: data }, { new: true });
  return post ? post.toObject() : null;
}

export async function savePostVersion(postId: string, content: string, userId: string): Promise<void> {
  await connectDB();
  const post = await Post.findById(postId);
  if (!post) return;

  const version: PostVersion = { content, savedAt: new Date(), savedBy: userId };
  const versions = [...(post.versions || []), version];
  // Keep only last 10 versions
  if (versions.length > 10) versions.splice(0, versions.length - 10);

  await Post.findByIdAndUpdate(postId, { $set: { versions } });
}

export async function getPost(id: string): Promise<IPost | null> {
  await connectDB();
  const post = await Post.findById(id);
  return post ? post.toObject() : null;
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  await connectDB();
  const post = await Post.findOne({ slug });
  return post ? post.toObject() : null;
}

export async function getPosts(filters?: {
  status?: string;
  authorId?: string;
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ posts: IPost[]; total: number; pages: number }> {
  await connectDB();
  const query: Record<string, unknown> = {};
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;

  if (filters?.status) query.status = filters.status;
  if (filters?.authorId) query.authorId = filters.authorId;
  if (filters?.category) query.category = filters.category;
  if (filters?.tag) query.tags = { $in: [filters.tag] };
  if (filters?.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { excerpt: { $regex: filters.search, $options: 'i' } },
      { tags: { $in: [new RegExp(filters.search, 'i')] } },
    ];
  }

  const sortField = filters?.sortBy || 'createdAt';
  const sortDir = filters?.sortOrder === 'asc' ? 1 : -1;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort({ [sortField]: sortDir })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  return { posts: posts as IPost[], total, pages: Math.ceil(total / limit) };
}

export async function deletePost(id: string): Promise<boolean> {
  await connectDB();
  const result = await Post.findByIdAndDelete(id);
  if (result) {
    await Comment.deleteMany({ postId: id });
  }
  return !!result;
}

export async function incrementPostViews(id: string): Promise<void> {
  await connectDB();
  await Post.findByIdAndUpdate(id, { $inc: { 'stats.views': 1 } });
}

export async function getScheduledPostsDue(): Promise<IPost[]> {
  await connectDB();
  const now = new Date();
  const posts = await Post.find({
    status: 'scheduled',
    scheduledAt: { $lte: now },
  }).lean();
  return posts as IPost[];
}

export async function publishPost(id: string): Promise<IPost | null> {
  await connectDB();
  const post = await Post.findByIdAndUpdate(id, {
    $set: { status: 'published', publishedAt: new Date() },
  }, { new: true });
  return post ? post.toObject() : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMENTS
// ═══════════════════════════════════════════════════════════════════════════

export async function createComment(data: Partial<IComment>): Promise<IComment> {
  await connectDB();
  const comment = await Comment.create(data);
  // Update post comment count
  await Post.findByIdAndUpdate(data.postId, { $inc: { 'stats.comments': 1 } });
  return comment.toObject();
}

export async function getComments(filters?: {
  postId?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ comments: IComment[]; total: number; pages: number }> {
  await connectDB();
  const query: Record<string, unknown> = {};
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;

  if (filters?.postId) query.postId = filters.postId;
  if (filters?.status) query.status = filters.status;

  const [comments, total] = await Promise.all([
    Comment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Comment.countDocuments(query),
  ]);

  return { comments: comments as IComment[], total, pages: Math.ceil(total / limit) };
}

export async function updateCommentStatus(id: string, status: string): Promise<IComment | null> {
  await connectDB();
  const comment = await Comment.findByIdAndUpdate(id, { $set: { status } }, { new: true });
  return comment ? comment.toObject() : null;
}

export async function deleteComment(id: string): Promise<boolean> {
  await connectDB();
  const comment = await Comment.findById(id);
  if (comment) {
    await Post.findByIdAndUpdate(comment.postId, { $inc: { 'stats.comments': -1 } });
    await Comment.findByIdAndDelete(id);
    return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIBERS
// ═══════════════════════════════════════════════════════════════════════════

export async function addSubscriber(data: Partial<ISubscriber>): Promise<ISubscriber> {
  await connectDB();
  const existing = await Subscriber.findOne({ email: data.email });
  if (existing) {
    if (existing.status === 'unsubscribed') {
      existing.status = 'active';
      existing.subscribedAt = new Date();
      await existing.save();
      return existing.toObject();
    }
    throw new Error('Email already subscribed');
  }
  const subscriber = await Subscriber.create(data);
  return subscriber.toObject();
}

export async function getSubscribers(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ subscribers: ISubscriber[]; total: number; pages: number }> {
  await connectDB();
  const query: Record<string, unknown> = {};
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;

  if (filters?.status) query.status = filters.status;

  const [subscribers, total] = await Promise.all([
    Subscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Subscriber.countDocuments(query),
  ]);

  return { subscribers: subscribers as ISubscriber[], total, pages: Math.ceil(total / limit) };
}

export async function unsubscribe(token: string): Promise<boolean> {
  await connectDB();
  const sub = await Subscriber.findOneAndUpdate(
    { unsubscribeToken: token },
    { $set: { status: 'unsubscribed' } },
  );
  return !!sub;
}

export async function getAllActiveSubscriberEmails(): Promise<{ email: string; name: string }[]> {
  await connectDB();
  const subs = await Subscriber.find({ status: 'active' }).select('email name').lean();
  return subs.map(s => ({ email: s.email, name: s.name }));
}

// ═══════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB();
  const user = await User.findById(id);
  return user ? user.toObject() : null;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  return user ? user.toObject() : null;
}

export async function updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
  await connectDB();
  const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true });
  return user ? user.toObject() : null;
}

export async function updateSocialAccount(
  userId: string,
  platform: 'twitter' | 'linkedin' | 'threads',
  accountData: Record<string, unknown>,
): Promise<void> {
  await connectDB();
  const updateKey = `socialAccounts.${platform}`;
  await User.findByIdAndUpdate(userId, { $set: { [updateKey]: accountData } });
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL QUEUE
// ═══════════════════════════════════════════════════════════════════════════

export async function createQueueItem(data: Partial<ISocialQueue>): Promise<ISocialQueue> {
  await connectDB();
  const item = await SocialQueue.create(data);
  return item.toObject();
}

export async function getPendingQueue(): Promise<ISocialQueue[]> {
  await connectDB();
  const items = await SocialQueue.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() },
  }).lean();
  return items as ISocialQueue[];
}

export async function updateQueueItem(id: string, data: Partial<ISocialQueue>): Promise<void> {
  await connectDB();
  await SocialQueue.findByIdAndUpdate(id, { $set: data });
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

export async function getAnalyticsOverview(userId?: string) {
  await connectDB();
  const postFilter: Record<string, unknown> = {};
  if (userId) postFilter.authorId = userId;

  const [
    totalPosts,
    totalComments,
    totalSubscribers,
    posts,
    topPosts,
  ] = await Promise.all([
    Post.countDocuments(postFilter),
    Comment.countDocuments(),
    Subscriber.countDocuments({ status: 'active' }),
    Post.find(postFilter).select('stats').lean(),
    Post.find({ ...postFilter, status: 'published' })
      .sort({ 'stats.views': -1 })
      .limit(5)
      .select('title slug stats')
      .lean(),
  ]);

  const totalViews = posts.reduce((sum, p) => sum + (p.stats?.views || 0), 0);

  // Generate mock daily views for last 30 days (in production, use a views collection)
  const dailyViews = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 100 + totalViews / 30),
    };
  });

  return {
    totalPosts,
    totalViews,
    totalComments,
    totalSubscribers,
    dailyViews,
    topPosts: topPosts.map(p => ({
      id: (p._id as string).toString(),
      title: p.title,
      slug: p.slug,
      stats: p.stats,
    })),
    socialReach: { twitter: 0, linkedin: 0, threads: 0, total: 0 },
  };
}
