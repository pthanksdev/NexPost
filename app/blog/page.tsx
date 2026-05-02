import Link from 'next/link';
import { getPosts } from '@/lib/db/queries';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default async function GlobalBlogFeed() {
  const { posts } = await getPosts({ status: 'published', limit: 30 });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-800/50 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/20">
            N
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">NexPost</span>
        </Link>
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input className="pl-10 h-10 bg-slate-900/50 border-slate-800" placeholder="Search blogs..." />
          </div>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 lg:py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-4">
              Explore the feed
            </h1>
            <p className="text-xl text-slate-400">
              Discover articles from creators across the platform.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" className="cursor-pointer">Trending</Badge>
            <Badge variant="secondary" className="cursor-pointer">Recent</Badge>
            <Badge variant="secondary" className="cursor-pointer">Technology</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl">
              The feed is quiet... for now.
            </div>
          ) : (
            posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.authorName.toLowerCase().replace(/\s+/g, '-')}/${post.slug}`} 
                className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:bg-slate-900/60 transition-colors"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900 relative border-b border-slate-800">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/10" />
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <span className="font-medium text-violet-400 uppercase tracking-wider">{post.category}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-300">{post.authorName}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-violet-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
