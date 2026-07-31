'use client';

import React, { use } from 'react';
import Link from 'next/link';

export default function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-8 font-sans">
      <nav className="font-sans text-xs text-on-surface-variant flex items-center space-x-2 font-semibold">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-primary transition-colors">
          Chronicles
        </Link>
        <span>/</span>
        <span className="text-primary font-bold">Article Details</span>
      </nav>

      <header className="border-b border-outline-variant/30 pb-6 space-y-4">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold">
          Bespoke Design • July 11, 2026
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
          Selection Metrics for Acrylic Frames and Architectural Displays
        </h1>
      </header>

      <div className="aspect-[16/9] bg-surface-container-low border border-outline-variant/20 overflow-hidden rounded-sm">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury display banner"
          className="w-full h-full object-cover"
        />
      </div>

      <article className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p>
          Bespoke interior design requires perfect harmony between artwork materials and architectural spaces. In modern minimalist settings, a heavy border or standard glass block can create visual friction, making the display feel archaic rather than contemporary.
        </p>
        <p>
          Our personalization studio uses high-fidelity UV printing techniques to mount pictures directly onto crystal-clear acrylic sheets. This eliminates light refraction gaps, producing a floating 3D effect that coordinates beautifully with ambient light.
        </p>
        <h3 className="font-serif text-xl font-bold text-primary pt-4">Why Thickness Matters</h3>
        <p>
          We offer 3mm and 5mm museum-grade sheets. While 3mm works wonderfully for smaller tabletop or desktop frames (A4/A3 portrait prints), larger wall installations (A2 and 2x3 feet mounts) benefit heavily from the rigid structure and luxurious depth of 5mm premium acrylic.
        </p>
      </article>

      <div className="border-t border-outline-variant/30 pt-8 text-center">
        <Link
          href="/blogs"
          className="px-8 py-4 bg-primary text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-secondary transition-all inline-block"
        >
          Back to Journal
        </Link>
      </div>
    </div>
  );
}
