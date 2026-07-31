'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured Admin Panel Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-neutral-200/80 p-10 rounded-lg shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Admin gold stripe accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary"></div>
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>

        {/* Error Icon */}
        <div className="w-16 h-16 bg-neutral-50 text-secondary rounded-full flex items-center justify-center mx-auto border border-neutral-100 shadow-inner">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.25em] text-secondary font-bold uppercase block">
            Studio Control Error
          </span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Console Engine Crash
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
            An error occurred while compiling components in the Studio administration space. You can try refreshing the control panel cache.
          </p>
        </div>

        {/* Error Message Display */}
        <div className="bg-neutral-50 border border-neutral-100 rounded p-4 text-left max-h-32 overflow-y-auto">
          <p className="font-mono text-[10px] text-neutral-500 break-all leading-normal">
            {error?.message || 'Unknown administrative execution error'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/95 transition-all rounded shadow-sm"
          >
            Retry Dashboard Load
          </button>
          <Link
            href="/admin"
            className="w-full py-3.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-950 text-xs font-bold uppercase tracking-widest hover:border-neutral-300 transition-all rounded"
          >
            Return to Dashboard Root
          </Link>
        </div>
      </div>
    </div>
  );
}
