import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-outline-variant/30 pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Logidecore Studio Policies
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Terms & Conditions
        </h1>
      </header>

      <article className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p><strong>Effective Date: July 11, 2026</strong></p>
        
        <h3 className="font-serif text-lg font-bold text-primary pt-4">1. Scope of Service</h3>
        <p>
          Logidecore provides bespoke custom sizing and printing of artwork and user-submitted digital pictures onto premium quality acrylic surfaces.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">2. Intellectual Property Rights</h3>
        <p>
          You represent and warrant that you own or have the licensing permissions for all graphics, logos, and photographs you upload. We reserve the right to decline processing containing abusive or copyrighted images.
        </p>
      </article>
    </div>
  );
}
