'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HERO_SLIDES = [
  {
    image: '/background-1.png',
    title: 'Timeless Elegance for Modern Spaces',
    subtitle: 'The Signature Collection',
    ctaLink: '/category/acrylic-photo-frames',
  },
  {
    image: '/backhround-2.png',
    title: 'Precision Personalization',
    subtitle: 'God Acrylic Photo Mounts',
    ctaLink: '/category/acrylic-photo-frames',
  },
  {
    image: '/background-3.png',
    title: 'Elevate Your Interior Vision',
    subtitle: 'Acrylic Logo & Plates',
    ctaLink: '/category/house-name-plates',
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-background">
      {/* Hero Carousel Section */}
      <section className="relative h-[50vh] sm:h-[70vh] overflow-hidden bg-black py-0">
        <div className="absolute inset-0 flex">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Link href={slide.ctaLink} className="absolute inset-0 block w-full h-full cursor-pointer">
                <img
                  alt={slide.title}
                  className="w-full h-full object-cover object-top opacity-100"
                  src={slide.image}
                />
              </Link>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-[2px] transition-all ${
                index === currentSlide ? 'bg-secondary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Floating Features Bar */}
      <div className="relative -mt-10 sm:-mt-14 z-30 max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl md:rounded-full shadow-xl py-6 px-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x-0 md:divide-x divide-neutral-200/60 dark:divide-neutral-800 font-sans">
          
          {/* 1. PREMIUM ACRYLIC */}
          <div className="flex flex-col items-center justify-center space-y-2.5 px-2">
            <span className="material-symbols-outlined text-[32px] text-amber-600 dark:text-amber-500">diamond</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-tight">
              Premium Acrylic
            </span>
          </div>

          {/* 2. DURABLE & LONG LASTING */}
          <div className="flex flex-col items-center justify-center space-y-2.5 px-2">
            <span className="material-symbols-outlined text-[32px] text-amber-600 dark:text-amber-500">gpp_good</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-tight">
              Durable & Long Lasting
            </span>
          </div>

          {/* 3. CRYSTAL CLEAR DISPLAY */}
          <div className="flex flex-col items-center justify-center space-y-2.5 px-2">
            <span className="material-symbols-outlined text-[32px] text-amber-600 dark:text-amber-500">image</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-tight">
              Crystal Clear Display
            </span>
          </div>

          {/* 4. PERFECT GIFT */}
          <div className="flex flex-col items-center justify-center space-y-2.5 px-2">
            <span className="material-symbols-outlined text-[32px] text-amber-600 dark:text-amber-500">redeem</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-tight">
              Perfect Gift
            </span>
          </div>

          {/* 5. EASY TO MOUNT */}
          <div className="flex flex-col items-center justify-center space-y-2.5 px-2">
            <span className="material-symbols-outlined text-[32px] text-amber-600 dark:text-amber-500">workspace_premium</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-tight">
              Easy To Mount
            </span>
          </div>

        </div>
      </div>

      {/* Trending Header */}
      <section className="py-12 bg-white text-center">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20">
          <span className="font-sans text-xs uppercase tracking-widest text-on-surface-variant block mb-2 font-bold">
            Trending on Logidecore
          </span>
          <h2 className="font-serif text-3xl md:text-4xl uppercase font-bold tracking-tight text-primary">
            Our Products
          </h2>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24 max-w-[1440px] mx-auto px-4 md:px-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-5">
                <div className="aspect-square rounded-sm bg-neutral-200 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-900/60" />
                <div className="space-y-2 flex flex-col items-center">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                  <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod) => {
              const thumbnail = prod.images?.find((img: any) => img.isThumbnail)?.imageUrl || prod.images?.[0]?.imageUrl || '';
              return (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  className="group cursor-pointer block"
                >
                  <div className="aspect-square overflow-hidden mb-6 rounded-sm bg-surface-container-low border border-neutral-100">
                    {thumbnail ? (
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={prod.name}
                        src={thumbnail}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs uppercase font-bold tracking-wider">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif text-xl font-bold mb-1 group-hover:text-secondary transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="font-sans text-xs text-secondary font-bold uppercase tracking-wider">
                      From Rs. {prod.basePrice}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary text-white text-center">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/40 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 relative z-10 font-sans">
          <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight text-white">
            Bring Your Favorite Moments to Life
          </h2>
          <p className="text-sm md:text-base mb-12 max-w-2xl mx-auto text-neutral-200 leading-relaxed">
            Instantly upload your photos to preview and customize museum-grade acrylic frames, house name plates, or template-based birthday collages in our online mounting studio.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              className="px-12 py-5 bg-white text-primary hover:bg-neutral-100 transition-all duration-300 font-bold text-xs uppercase tracking-widest cursor-pointer"
              href="/category/all"
            >
              Customize Your Frame
            </Link>
            <Link
              className="px-12 py-5 bg-transparent text-white border border-white hover:bg-white hover:text-black transition-all duration-300 font-bold text-xs uppercase tracking-widest cursor-pointer"
              href="/contact"
            >
              Contact Studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
