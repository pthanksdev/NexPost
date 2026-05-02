import Link from 'next/link';
import { getPosts } from '@/lib/db/queries';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { User } from '@/lib/db/models';
import connectDB from '@/lib/db/connect';

export default async function UserBlogIndexPage({ params }: { params: { username: string } }) {
  await connectDB();
  
  // Find the user by their name or a username field (we use name for now, removing spaces)
  // In a real app, you'd add a unique 'username' field to the User model.
  const regex = new RegExp(`^${params.username.replace(/-/g, ' ')}$`, 'i');
  const user = await User.findOne({ name: regex });
  
  if (!user) notFound();

  const { posts } = await getPosts({ 
    status: 'published', 
    limit: 20,
    authorId: user._id.toString() 
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-800/50 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">{user.name}&apos;s Blog</span>
        </Link>
        <nav className="flex gap-4 items-center">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Powered by NexPost
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 lg:py-24 max-w-5xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-4">
            Latest from {user.name}
          </h1>
          <p className="text-xl text-slate-400">
            Insights, updates, and stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {posts.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-500">
              No published posts yet. Check back soon!
            </div>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${params.username}/${post.slug}`} className="group block">
                <article className="space-y-4">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 relative">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center text-slate-700">
                        No cover image
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span>•</span>
                      <time dateTime={post.publishedAt?.toString()}>
                        {formatRelativeTime(post.publishedAt || post.createdAt)}
                      </time>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-violet-500 text-sm font-medium pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read article <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
