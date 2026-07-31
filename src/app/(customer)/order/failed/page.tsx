'use client';

import React from 'react';
import Link from 'next/link';

export default function OrderFailedPage() {
  return (
    <div className="bg-background min-h-screen py-24 px-6 md:px-20 max-w-[1440px] mx-auto text-center">
      <div className="max-w-md mx-auto space-y-8 bg-white border border-outline-variant/30 p-12 rounded-sm shadow-sm">
        <span className="material-symbols-outlined text-6xl text-red-600 block">
          error
        </span>
        
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-red-600 font-bold mb-2 block">
            Payment Verification Failed
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-primary mb-3">
            Transaction Declined
          </h1>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            The payment gateway declined your transaction. Please verify your payment credentials or check with your bank.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-sans text-xs font-bold uppercase tracking-widest">
          <Link
            href="/checkout"
            className="w-full py-4 bg-primary text-white hover:bg-secondary transition-all flex items-center justify-center gap-2"
          >
            Retry Checkout
          </Link>
          <Link
            href="/contact"
            className="w-full py-4 border border-outline-variant/50 hover:border-primary transition-all flex items-center justify-center gap-2"
          >
            Get Help Support
          </Link>
        </div>
      </div>
    </div>
  );
}
