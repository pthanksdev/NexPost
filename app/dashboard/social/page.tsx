import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { PlatformCard } from '@/components/social/PlatformCard';
import { SocialPostComposer } from '@/components/social/SocialPostComposer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function SocialDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/dashboard');
  }

  const user = await getUserById(session.user.id);
  if (!user) return null;

  const { twitter, linkedin, threads } = user.socialAccounts || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Social Media</h1>
        <p className="text-slate-400 mt-2">
          Manage your connected accounts and cross-post content automatically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PlatformCard 
          platform="twitter" 
          account={twitter} 
          connectUrl="/api/social/twitter/connect" 
        />
        <PlatformCard 
          platform="linkedin" 
          account={linkedin} 
          connectUrl="/api/social/linkedin/connect" 
        />
        <PlatformCard 
          platform="threads" 
          account={threads} 
          connectUrl="/api/social/threads/connect" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Post Composer</CardTitle>
        </CardHeader>
        <CardContent>
          <SocialPostComposer accounts={{ twitter, linkedin, threads }} />
        </CardContent>
      </Card>
    </div>
  );
}
