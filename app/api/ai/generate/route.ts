import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiGenerateSchema } from '@/lib/validations';
import { generatePostContent } from '@/lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = aiGenerateSchema.parse(body);

    if (parsed.type === 'generate') {
      const content = await generatePostContent(parsed.title, parsed.outline);
      return NextResponse.json({ success: true, content });
    }

    return NextResponse.json({ error: 'Invalid AI operation type' }, { status: 400 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
