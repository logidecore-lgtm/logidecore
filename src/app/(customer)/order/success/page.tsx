'use client';

import React, { use } from 'react';
import Link from 'next/link';

export default function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedParams = use(searchParams);
  const orderId = resolvedParams.id || 'LD-928471';

  return (
    <div className="bg-background min-h-screen py-24 px-6 md:px-20 max-w-[1440px] mx-auto text-center">
      <div className="max-w-md mx-auto space-y-8 bg-white border border-outline-variant/30 p-12 rounded-sm shadow-sm">
        <span className="material-symbols-outlined text-6xl text-secondary animate-bounce block">
          check_circle
        </span>
        
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
            Thank You for Your Order
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-primary mb-3">
            Purchase Confirmed
          </h1>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Your custom art request has been sent to our personalization studio. An invoice and email confirmation have been sent.
          </p>
        </div>

        <div className="p-4 bg-surface-container-low/60 rounded text-xs font-sans space-y-2 border border-outline-variant/10">
          <div className="flex justify-between font-semibold">
            <span className="text-on-surface-variant">Order Reference:</span>
            <span className="text-primary font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-on-surface-variant">Status:</span>
            <span className="text-secondary font-bold">STUDIO PROCESSING</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 font-sans text-xs font-bold uppercase tracking-widest">
          <Link
            href={`/order/track?id=${orderId}`}
            className="w-full py-4 bg-primary text-white hover:bg-secondary transition-all flex items-center justify-center gap-2"
          >
            Track Order Status
          </Link>
          <Link
            href="/"
            className="w-full py-4 border border-outline-variant/50 hover:border-primary transition-all flex items-center justify-center gap-2"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
