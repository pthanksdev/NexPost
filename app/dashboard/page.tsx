import { getAnalyticsOverview } from '@/lib/db/queries';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Eye, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  
  // Fetch all analytics for the single user
  const analytics = await getAnalyticsOverview();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Overview</h1>
        <p className="text-slate-400 mt-2">
          Here&apos;s how your content is performing across all platforms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={formatNumber(analytics.totalPosts)}
          icon={FileText}
          description="Published & scheduled"
        />
        <StatsCard
          title="Total Views"
          value={formatNumber(analytics.totalViews)}
          icon={Eye}
          trend={{ value: 12.5, isPositive: true }}
          description="vs last month"
        />
        <StatsCard
          title="Total Comments"
          value={formatNumber(analytics.totalComments)}
          icon={MessageSquare}
          description="Across all posts"
        />
        <StatsCard
          title="Subscribers"
          value={formatNumber(analytics.totalSubscribers)}
          icon={Users}
          trend={{ value: 4.1, isPositive: true }}
          description="Active mailing list"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Views Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-md">
               {/* Note: In a real app, use Recharts here. Returning simple placeholder for now */}
               <TrendingUp className="mr-2 h-5 w-5 text-violet-500" />
               Chart rendering (Recharts)
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics.topPosts.length === 0 ? (
                <div className="text-sm text-slate-400">No posts published yet.</div>
              ) : (
                analytics.topPosts.map((post, i) => (
                  <div key={post.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-medium text-slate-300">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate text-slate-200">
                        {post.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        /{post.slug}
                      </p>
                    </div>
                    <div className="font-medium tabular-nums text-violet-400">
                      {formatNumber(post.stats?.views || 0)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
