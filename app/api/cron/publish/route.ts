import { NextResponse } from 'next/server';
import { getScheduledPostsDue, publishPost, createQueueItem } from '@/lib/db/queries';
import { User } from '@/lib/db/models';

export async function GET(req: Request) {
  try {
    // Verify auth header for Vercel Cron
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const duePosts = await getScheduledPostsDue();
    if (duePosts.length === 0) {
      return NextResponse.json({ success: true, message: 'No posts due for publishing' });
    }

    const results = [];

    for (const post of duePosts) {
      // 1. Publish post
      const published = await publishPost(post.id as string);
      if (!published) continue;

      // 2. Queue social posts if enabled
      const author = await User.findById(post.authorId);
      if (author && author.socialAccounts) {
        const platformsToPost = [];
        const accounts = author.socialAccounts;

        if (accounts.twitter?.connected && accounts.twitter?.autoPost) platformsToPost.push('twitter');
        if (accounts.linkedin?.connected && accounts.linkedin?.autoPost) platformsToPost.push('linkedin');
        if (accounts.threads?.connected && accounts.threads?.autoPost) platformsToPost.push('threads');

        if (platformsToPost.length > 0) {
          await createQueueItem({
            postId: post.id as string,
            userId: author.id as string,
            platforms: platformsToPost,
            messages: post.social?.customMessages || { twitter: '', linkedin: '', threads: '' },
            status: 'pending',
            scheduledFor: new Date(),
          });
        }
      }

      results.push({ postId: post.id, title: post.title, queuedSocial: true });
    }

    return NextResponse.json({ success: true, publishedCount: duePosts.length, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
