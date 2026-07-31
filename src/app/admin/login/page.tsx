'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Success, redirect to admin panel
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-neutral-200 p-10 rounded-lg shadow-lg relative z-10">
        <div className="text-center space-y-3 mb-8">
          <span className="text-[10px] tracking-[0.2em] text-secondary font-bold uppercase">
            Logidecore Admin
          </span>
          <h1 className="text-3xl font-serif font-bold text-primary">Studio Control</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Sign in with administrative credentials to manage product design lines, categories, and media.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-xs font-semibold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@logidecore.com"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none text-neutral-900 focus:border-primary transition-all placeholder:text-neutral-400 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none text-neutral-900 focus:border-primary transition-all placeholder:text-neutral-400 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/95 transition-all rounded shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
