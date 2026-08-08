'use client';

import { useEffect, useState, useRef } from 'react';

interface ReviewScreenshot {
  id: string;
  imageUrl: string;
  categoryId: string | null;
  createdAt: string;
}

export default function CustomerReviewsCarousel({ categoryId, categorySlug }: { categoryId?: string; categorySlug?: string }) {
  const [reviews, setReviews] = useState<ReviewScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        let url = '/api/reviews';
        const params = new URLSearchParams();
        if (categoryId) params.append('categoryId', categoryId);
        if (categorySlug) params.append('categorySlug', categorySlug);
        
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setReviews(data);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [categoryId, categorySlug]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center font-sans space-y-3">
        <div className="animate-pulse rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Loading Customer Experiences...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // hide section cleanly if no screenshots uploaded
  }

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-950 border-t border-b border-neutral-200/60 dark:border-neutral-900/60 transition-colors duration-300 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Customer Reviews
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-white p-2.5 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-800 hover:bg-primary hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Scroll Left"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-white p-2.5 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-800 hover:bg-primary hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Scroll Right"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>

          {/* Horizontal Scrolling Box */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pr-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Spacer */}
            <div className="w-2 shrink-0 sm:hidden"></div>

            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-850 shadow-md dark:shadow-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
              >
                <div className="aspect-[9/16] relative overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                  <img
                    src={review.imageUrl}
                    alt="Customer Chat Feedback"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}

            {/* Spacer */}
            <div className="w-2 shrink-0 sm:hidden"></div>
          </div>
        </div>

        {/* Bottom Social Proof Badge */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-full shadow-sm text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span>Thousands of customers trust our product quality & service</span>
          </div>
        </div>

      </div>
    </section>
  );
}
