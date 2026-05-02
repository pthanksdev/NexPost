import { z } from 'zod';

// ─── Auth Schemas ──────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Post Schemas ──────────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().optional().default(''),
  excerpt: z.string().optional().default(''),
  coverImage: z.string().url().optional().or(z.literal('')).default(''),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional().default('General'),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).optional().default('draft'),
  scheduledAt: z.string().datetime().nullable().optional(),
  seo: z.object({
    metaTitle: z.string().optional().default(''),
    metaDescription: z.string().optional().default(''),
    focusKeyword: z.string().optional().default(''),
    canonicalUrl: z.string().optional().default(''),
    ogImage: z.string().optional().default(''),
  }).optional(),
  social: z.object({
    customMessages: z.object({
      twitter: z.string().max(280).optional().default(''),
      linkedin: z.string().max(3000).optional().default(''),
      threads: z.string().max(500).optional().default(''),
    }).optional(),
  }).optional(),
});

export const updatePostSchema = createPostSchema.partial();

// ─── Comment Schemas ───────────────────────────────────────────────────────

export const createCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  authorName: z.string().min(1, 'Name is required').max(100),
  authorEmail: z.string().email('Invalid email'),
  content: z.string().min(1, 'Comment cannot be empty').max(5000),
  parentId: z.string().optional().nullable(),
});

export const updateCommentStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'spam']),
});

// ─── Subscriber Schemas ────────────────────────────────────────────────────

export const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100),
});

// ─── Social Post Schema ───────────────────────────────────────────────────

export const socialPostSchema = z.object({
  postId: z.string().min(1),
  message: z.string().min(1, 'Message is required'),
  platforms: z.array(z.enum(['twitter', 'linkedin', 'threads'])).min(1),
});

// ─── AI Schemas ────────────────────────────────────────────────────────────

export const aiGenerateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  outline: z.string().optional().default(''),
  type: z.enum(['generate', 'improve', 'seo', 'social', 'titles', 'spam']).default('generate'),
});

export const aiImproveSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  mode: z.enum(['rewrite', 'expand', 'shorten', 'grammar']),
});

export const aiSeoSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const aiSocialSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  url: z.string().url(),
});

export const aiSpamSchema = z.object({
  comment: z.string().min(1),
  authorName: z.string().min(1),
  authorEmail: z.string().email(),
});

// ─── Settings Schemas ──────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  image: z.string().url().optional().or(z.literal('')),
  preferences: z.object({
    emailNotifications: z.boolean().optional(),
    defaultCategory: z.string().optional(),
  }).optional(),
});

export const blogSettingsSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  domain: z.string().optional(),
  logo: z.string().url().optional().or(z.literal('')),
});

// ─── Schedule Schema ──────────────────────────────────────────────────────

export const schedulePostSchema = z.object({
  postId: z.string().min(1),
  scheduledAt: z.string().datetime('Invalid datetime format'),
});

export const publishPostSchema = z.object({
  postId: z.string().min(1),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
export type CreateCommentData = z.infer<typeof createCommentSchema>;
export type SubscribeData = z.infer<typeof subscribeSchema>;
export type SocialPostData = z.infer<typeof socialPostSchema>;
