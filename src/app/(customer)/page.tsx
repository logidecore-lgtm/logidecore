'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HERO_SLIDES = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKSbnHsi57BAR4LZVQtzvDZnlb2-XSRqAxaURxjqv5jqKwTqYjoHW_BMl-mXHNZvav8w0Jj6NPMESVt1OLzJuLxY4f7DckQfOnGPWLEunEldcIHQ_s-btg8X0ZUZE0SlEHtJh_Avly45LddXbpoRxICDTYAYebMXQpC3FF8G4ibXBRMfbDPl1vW6tiZ0AGBIil26qrqP9HSQpvf9Hzea2c20bI_k7AFzYxlW5f6s3OqjGsfY-MkZDl9NP9HrLiazsnaiTJppVb4XET',
    title: 'Timeless Elegance for Modern Spaces',
    subtitle: 'The Signature Collection',
    ctaLink: '/category/acrylic-photo-frames',
  },
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    title: 'Precision Personalization',
    subtitle: 'God Acrylic Photo Mounts',
    ctaLink: '/category/acrylic-photo-frames',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
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
      <section className="relative h-[70vh] overflow-hidden bg-black px-4 md:px-20 py-8">
        <div className="absolute inset-0 flex">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                alt={slide.title}
                className="w-full h-full object-cover opacity-70"
                src={slide.image}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="font-sans text-xs uppercase tracking-[0.3em] mb-4 text-secondary font-bold">
                  {slide.subtitle}
                </span>
                <h1 className="font-serif text-3xl md:text-6xl text-white mb-8 max-w-4xl leading-tight">
                  {slide.title}
                </h1>
                <Link
                  href={slide.ctaLink}
                  className="px-12 py-5 bg-secondary text-white font-sans text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 font-bold"
                >
                  Shop Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
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
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
