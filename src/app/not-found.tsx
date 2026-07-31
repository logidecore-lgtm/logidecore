import React from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col justify-center items-center px-6 md:px-20 text-center font-sans">
      <div className="max-w-md space-y-8 bg-white border border-outline-variant/30 p-12 rounded-sm shadow-sm">
        <span className="material-symbols-outlined text-6xl text-secondary block">
          running_with_errors
        </span>
        
        <div>
          <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
            Error Code 404
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary mb-3">
            Bespoke Space Not Found
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The collection, frame configuration, or page reference you are trying to access does not exist in our studio registry.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-sans text-xs font-bold uppercase tracking-widest">
          <Link
            href="/"
            className="w-full py-4 bg-primary text-white hover:bg-secondary transition-all flex items-center justify-center gap-2"
          >
            Return to Studio
          </Link>
          <Link
            href="/contact"
            className="w-full py-4 border border-outline-variant/50 hover:border-primary transition-all flex items-center justify-center gap-2 animate-pulse"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
