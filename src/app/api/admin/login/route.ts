import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, setSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide both email and password' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const hashed = await hashPassword(password);
    if (admin.password !== hashed) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: 'ADMIN',
    });

    return NextResponse.json({ success: true, user: { name: admin.name, email: admin.email } });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
