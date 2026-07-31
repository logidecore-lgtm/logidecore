'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics or error tracking service
    console.error('Captured Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-neutral-200/80 p-10 rounded-lg shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Decorative subtle background accents */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>

        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100 shadow-inner">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.25em] text-red-500 font-bold uppercase block">
            Application Error
          </span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Something went wrong
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while rendering this page. The team has been notified and we are working to resolve it.
          </p>
        </div>

        {/* Error Message Display */}
        <div className="bg-neutral-50 border border-neutral-100 rounded p-4 text-left max-h-32 overflow-y-auto">
          <p className="font-mono text-[10px] text-neutral-500 break-all leading-normal">
            {error?.message || 'Unknown execution error'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/95 transition-all rounded shadow-sm hover:shadow active:scale-[0.98]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full py-3.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-950 text-xs font-bold uppercase tracking-widest hover:border-neutral-300 transition-all rounded"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
