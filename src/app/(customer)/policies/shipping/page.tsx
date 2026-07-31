import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-outline-variant/30 pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Logidecore Studio Policies
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Shipping & Delivery Policy
        </h1>
      </header>

      <article className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p><strong>Effective Date: July 11, 2026</strong></p>
        
        <h3 className="font-serif text-lg font-bold text-primary pt-4">1. Shipping Charges</h3>
        <p>
          We offer FREE shipping across India for all cart subtotals exceeding Rs. 1,500. For orders below Rs. 1,500, a flat shipping and safe-packing fee of Rs. 99 is charged.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">2. Personalized Production Timelines</h3>
        <p>
          UV mounting and acrylic frame polishing take 2 to 3 studio business days. Courier shipping transit adds 3 to 5 business days depending on location.
        </p>
      </article>
    </div>
  );
}
