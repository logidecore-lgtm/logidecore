import { cookies } from 'next/headers';
import { db } from './db';

export type Role = 'CUSTOMER' | 'ADMIN' | 'SUPPORT';

const SESSION_COOKIE_NAME = 'logidecore-session';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-luxury-key-1234567890';

// A lightweight JSON session implementation
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

// Simple base64 token encoding (sign/verify simulation for session)
function encryptSession(user: SessionUser): string {
  const data = JSON.stringify({ user, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return Buffer.from(data).toString('base64');
}

function decryptSession(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(raw);
    if (data.expires < Date.now()) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decryptSession(token);
}

export async function setSession(user: SessionUser) {
  const token = encryptSession(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Simulated password hashing (using simple secure-looking hash for demo resilience)
// To keep things zero-dep, we can use simple SHA-256 via WebCrypto
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + JWT_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
