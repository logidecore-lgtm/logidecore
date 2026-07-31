import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-outline-variant/30 pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Our Heritage
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Bespoke Craftsmanship
        </h1>
      </header>

      <article className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p>
          Founded in 2024, Logidecore was created to redefine the intersection of personalization photography and architectural decor. We believe that custom printing should not compromise on luxury aesthetic values.
        </p>
        <p>
          Every acrylic mount, welcome board, and custom house name plate that leaves our Delhi personalization studio is individually calibrated, double scratch checked, and wrapped in thick safety crates to guarantee absolute pixel perfection.
        </p>
        <p>
          Our materials are sourced from the highest grade acrylic manufacturers, giving our frames up to 92% light transmittance (surpassing standard window glass) and providing built-in UV protectant barriers that shield your prints against fading.
        </p>
      </article>

      <div className="text-center pt-8">
        <Link
          href="/category/all"
          className="px-8 py-4 bg-primary text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-secondary transition-all inline-block"
        >
          Browse Studio Collection
        </Link>
      </div>
    </div>
  );
}
