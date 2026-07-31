'use server';

import { db } from '@/lib/db';
import { hashPassword, setSession, clearSession, Role } from '@/lib/auth';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password' };
  }

  try {
    // First check if it is a customer
    let user = await db.customer.findUnique({ where: { email } });
    let role: Role = 'CUSTOMER';

    // If not a customer, check if it is an admin
    if (!user) {
      const admin = await db.admin.findUnique({ where: { email } });
      if (admin) {
        user = {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: null,
          password: admin.password,
          createdAt: admin.createdAt,
        };
        role = 'ADMIN';
      }
    }

    if (!user || !user.password) {
      return { error: 'Invalid email or password' };
    }

    const hashed = await hashPassword(password);
    if (user.password !== hashed) {
      return { error: 'Invalid email or password' };
    }

    // Set Session
    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: role,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return { error: 'Something went wrong. Please try again.' };
  }

  // Redirect after setting session
  redirect('/');
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!email || !password || !name) {
    return { error: 'Name, email, and password are required' };
  }

  try {
    const exists = await db.customer.findUnique({ where: { email } });
    if (exists) {
      return { error: 'Email is already registered' };
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.customer.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'CUSTOMER',
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return { error: 'Failed to create account. Please try again.' };
  }

  redirect('/');
}

export async function otpRequestAction(phone: string) {
  if (!phone) return { error: 'Phone number is required' };
  
  // Simulate sending OTP
  console.log(`Sending simulated OTP to ${phone}`);
  return { success: true, otp: '123456' }; // Return OTP for easy simulation testing
}

export async function otpVerifyAction(phone: string, otp: string) {
  if (!phone || !otp) return { error: 'Phone and OTP are required' };

  if (otp !== '123456') {
    return { error: 'Invalid OTP' };
  }

  try {
    // Check or create customer by phone
    const email = `${phone}@phonepe.logidecore.com`;
    let user = await db.customer.findUnique({ where: { email } });

    if (!user) {
      const dummyPassword = crypto.randomUUID();
      const hashedPassword = await hashPassword(dummyPassword);

      user = await db.customer.create({
        data: {
          email,
          name: `User ${phone.slice(-4)}`,
          phone,
          password: hashedPassword,
        },
      });
    }

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'CUSTOMER',
    });
  } catch (err: any) {
    console.error('OTP Login error:', err);
    return { error: 'Failed to authenticate via OTP' };
  }

  redirect('/');
}

export async function googleAuthAction() {
  // Simulate Google OAuth Redirect by immediately signing in a test user
  try {
    const email = 'google.user@example.com';
    let user = await db.customer.findUnique({ where: { email } });

    if (!user) {
      const dummyPassword = crypto.randomUUID();
      const hashedPassword = await hashPassword(dummyPassword);

      user = await db.customer.create({
        data: {
          email,
          name: 'Luxury Collector',
          password: hashedPassword,
        },
      });
    }

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'CUSTOMER',
    });
  } catch (err: any) {
    console.error('Google Auth error:', err);
  }

  redirect('/');
}

export async function logoutAction() {
  await clearSession();
  redirect('/login');
}
