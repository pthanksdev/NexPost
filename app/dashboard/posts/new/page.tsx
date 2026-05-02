import { MDXEditor } from '@/components/editor/MDXEditor';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <MDXEditor />
    </div>
  );
}
