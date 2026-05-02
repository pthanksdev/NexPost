import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/connect';
import { User } from '@/lib/db/models';
import { registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    await connectDB();

    const existingUser = await User.findOne({ email: parsed.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    const user = await User.create({
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      password: hashedPassword,
      socialAccounts: {
        twitter: { connected: false, accessToken: '', refreshToken: '', username: '', userId: '', autoPost: false },
        linkedin: { connected: false, accessToken: '', personUrn: '', displayName: '', autoPost: false },
        threads: { connected: false, accessToken: '', userId: '', username: '', autoPost: false },
      },
      preferences: { emailNotifications: true, defaultCategory: 'General' },
    });

    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
