import { MDXEditor } from '@/components/editor/MDXEditor';
import { getPost } from '@/lib/db/queries';
import { auth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const post = await getPost(params.id);
  if (!post) notFound();

  // Sanitize data for client component
  const initialData = {
    ...post,
    id: (post._id as string).toString(),
    _id: undefined,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <MDXEditor initialData={initialData} isEditing={true} />
    </div>
  );
}
