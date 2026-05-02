import { getPostBySlug, incrementPostViews } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/lib/db/models';
import connectDB from '@/lib/db/connect';

export async function generateMetadata({ params }: { params: { username: string, slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      images: [post.seo?.ogImage || post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { username: string, slug: string } }) {
  await connectDB();
  
  // Verify the user exists for this route
  const regex = new RegExp(`^${params.username.replace(/-/g, ' ')}$`, 'i');
  const user = await User.findOne({ name: regex });
  if (!user) notFound();

  const post = await getPostBySlug(params.slug);
  
  // Ensure the post belongs to this user
  if (!post || post.status !== 'published' || post.authorId !== user._id.toString()) {
    notFound();
  }

  await incrementPostViews(post.id as string);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-800/50 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href={`/blog/${params.username}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">{user.name}&apos;s Blog</span>
        </Link>
        <Link href={`/blog/${params.username}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </header>

      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-4xl">
          <header className="space-y-6 text-center mb-16">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-50 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-300">{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time>{formatRelativeTime(post.publishedAt || post.createdAt)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.stats?.readTime || 1} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(post.stats?.views || 0) + 1} views</span>
              </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 mb-16 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full" />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none prose-headings:text-slate-100 prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-img:rounded-xl">
            <MDXRemote source={post.content} />
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-2">
            {post.tags?.map(tag => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>
        </article>

        <section className="bg-slate-950 border-t border-slate-800 py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-6 h-6 text-violet-500" />
              <h2 className="text-2xl font-bold text-slate-100">Comments ({post.stats?.comments || 0})</h2>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
              <p>Comments are disabled for this demo.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
