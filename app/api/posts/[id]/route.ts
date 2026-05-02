import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updatePostSchema } from '@/lib/validations';
import { getPost, updatePost, savePostVersion } from '@/lib/db/queries';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await getPost(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updatePostSchema.parse(body);

    if (parsed.content && parsed.content !== post.content) {
      // Save current content as version before updating
      await savePostVersion(params.id, post.content, session.user.id);
    }

    const updated = await updatePost(params.id, parsed as any);

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
