import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPostSchema } from '@/lib/validations';
import { createPost } from '@/lib/db/queries';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createPostSchema.parse(body);

    const post = await createPost({
      ...(parsed as any),
      authorId: session.user.id,
      authorName: session.user.name || 'Anonymous',
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
