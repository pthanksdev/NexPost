import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Search, Globe, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function SEOPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">SEO Analysis</h1>
          <p className="text-slate-400">Optimize your content for search engines with AI insights.</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-500">
          <Search className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Overall SEO Score', value: '82', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Indexed Pages', value: '12', icon: Globe, color: 'text-blue-400' },
          { label: 'Pending Issues', value: '3', icon: AlertCircle, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-50">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100">Top Performing Pages</h3>
        </div>
        <div className="p-0">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-300">No SEO data yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">
              Start publishing posts to see your SEO performance and AI-driven suggestions here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
