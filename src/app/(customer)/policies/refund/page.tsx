import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-outline-variant/30 pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Logidecore Studio Policies
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Refund & Cancellation Policy
        </h1>
      </header>

      <article className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p><strong>Effective Date: July 11, 2026</strong></p>
        <p>
          Because our products are made-to-order, custom sized, and personalized with your own high-resolution photos and unique texts, we have specific parameters for refunds and exchanges.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">1. Custom Orders Policy</h3>
        <p>
          Custom Photo Frames, UV Frames, Acrylic Logo Mounts, and Personalized House Name Plates cannot be cancelled or refunded once personalization printing has commenced in our studio.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">2. Damage During Transit</h3>
        <p>
          We pack all frames in reinforced wooden crates. However, if your acrylic product arrives chipped, cracked, or damaged, send a photo proof to <span className="text-secondary font-bold">studio@logidecore.com</span> within 48 hours of delivery. We will courier a replacement at no extra charge.
        </p>
      </article>
    </div>
  );
}
