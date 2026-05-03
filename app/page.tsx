import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { ArrowRight, PenSquare, Share2, Search, Bot } from 'lucide-react';

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-800/50 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/20">
            N
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">NexPost</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button className="rounded-full shadow-lg shadow-violet-600/20">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
          
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300 mb-8 animate-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-violet-500 mr-2 animate-pulse" />
              NexPost v1.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-50 mb-8 max-w-4xl mx-auto leading-tight animate-in slide-in-from-bottom-5 duration-700">
              The modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">headless CMS</span> for ambitious creators
            </h1>
            
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto animate-in slide-in-from-bottom-6 duration-1000">
              Write beautifully with MDX, generate content with AI, and cross-post to Twitter, LinkedIn, and Threads automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000">
              <Link href="/register">
                <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-xl shadow-violet-600/20">
                  Start Writing for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base">
                  View Demo Blog
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">Everything you need to grow</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">A complete ecosystem for modern content creators.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: PenSquare,
                  title: "MDX Editor",
                  desc: "Write in markdown with rich component support and live preview."
                },
                {
                  icon: Bot,
                  title: "AI Assistant",
                  desc: "Generate outlines, improve grammar, and extract SEO metadata instantly."
                },
                {
                  icon: Share2,
                  title: "Auto-Publishing",
                  desc: "Schedule posts and automatically distribute to Twitter, LinkedIn, and Threads."
                },
                {
                  icon: Search,
                  title: "SEO Optimization",
                  desc: "Real-time scoring and suggestions to help you rank higher on Google."
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-violet-600/20 flex items-center justify-center mb-6 text-violet-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-12 bg-[#0a0a0f]">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-600 font-bold text-white text-xs">
              N
            </div>
            <span className="font-bold text-slate-200">NexPost</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} NexPost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
