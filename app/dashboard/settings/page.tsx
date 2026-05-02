import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = await getUserById(session.user.id);
  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} disabled />
              <p className="text-xs text-slate-500">Email cannot be changed.</p>
            </div>
            <div className="pt-4">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your app preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-slate-400">Receive email alerts for comments.</p>
              </div>
              <input type="checkbox" defaultChecked={user.preferences?.emailNotifications} className="h-5 w-5 accent-violet-600 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
