import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Zap, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-800/50 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/20">
            N
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">NexPost</span>
        </Link>
        <Link href="/register">
          <Button size="sm">Join Now</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Mission Section */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-6">Empowering the next generation of creators.</h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                NexPost was built on a simple idea: content creation shouldn&apos;t be a chore. We built a platform that handles the technical weight, so you can focus on the words.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-slate-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  icon: Zap,
                  title: "Speed",
                  desc: "Blazing fast performance for your readers, and an even faster writing experience for you."
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  desc: "Automatically distribute your content to major social platforms with a single click."
                },
                {
                  icon: Shield,
                  title: "Security",
                  desc: "Enterprise-grade encryption for your data and social media connections."
                },
                {
                  icon: CheckCircle2,
                  title: "Simplicity",
                  desc: "A clean, minimalist interface that stays out of your way."
                }
              ].map((value, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 text-center">
          <div className="container px-4 md:px-6 mx-auto max-w-xl">
            <h2 className="text-3xl font-bold text-slate-50 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Ready to start your journey?</h2>
            <Link href="/register">
              <Button size="lg" className="rounded-full px-12 h-14 text-lg">Create Your Blog</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-12 bg-[#0a0a0f]">
        <div className="container px-4 md:px-6 mx-auto text-center">
           <p className="text-sm text-slate-500">© 2026 NexPost. Built for creators.</p>
        </div>
      </footer>
    </div>
  );
}
