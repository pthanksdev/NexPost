import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Users, Mail, UserPlus, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default async function SubscribersPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">Subscribers</h1>
          <p className="text-slate-400">Manage your newsletter audience and growth.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-500">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search by email or name..." 
                className="pl-10 bg-slate-950 border-slate-800 focus:border-violet-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-300">Audience is empty</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-1">
                Your subscriber list is empty. Add your first subscriber manually or wait for people to sign up on your blog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
