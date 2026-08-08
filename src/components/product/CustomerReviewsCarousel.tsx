'use client';

import { useEffect, useState } from 'react';

interface ReviewScreenshot {
  id: string;
  imageUrl: string;
  categoryId: string | null;
  createdAt: string;
}

export default function CustomerReviewsCarousel({ categoryId, categorySlug }: { categoryId?: string; categorySlug?: string }) {
  const [reviews, setReviews] = useState<ReviewScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

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

  if (loading) {
    return (
      <section className="py-16 bg-neutral-50 dark:bg-neutral-950 border-t border-b border-neutral-200/60 dark:border-neutral-900/60 transition-colors duration-300 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Customer Reviews
            </h2>
            <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full"></div>
          </div>
          
          {/* Shimmer skeleton row */}
          <div className="flex gap-6 overflow-x-auto scrollbar-none pb-4 px-4 sm:px-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[180px] sm:w-[280px] shrink-0 rounded-2xl aspect-[9/16] bg-neutral-200 dark:bg-neutral-900 animate-pulse relative overflow-hidden border border-neutral-200/80 dark:border-neutral-800"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // hide section cleanly if no reviews exist
  }

  // Clone reviews list 3 times to make infinite smooth scroll track
  const marqueeReviews = [...reviews, ...reviews, ...reviews];

  // Adjust duration based on count so speed remains constant (roughly 8 seconds per image screen time)
  const animationDuration = `${Math.max(20, reviews.length * 8)}s`;

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-950 border-t border-b border-neutral-200/60 dark:border-neutral-900/60 transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Inject custom animation keyframe styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .marquee-container {
          display: flex;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 24px;
          animation: marqueeScroll ${animationDuration} linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-[1440px] mx-auto relative space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Customer Reviews
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Marquee Wrapper */}
        <div className="marquee-container py-4">
          <div className="marquee-track px-6">
            {marqueeReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="w-[180px] sm:w-[280px] shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-850 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.015]"
              >
                {/* Image layout container with skeleton placeholder */}
                <div className="aspect-[9/16] relative overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                  {!loadedImages[`${review.id}-${index}`] && (
                    <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-900 animate-pulse flex flex-col items-center justify-center space-y-2">
                      <span className="material-symbols-outlined text-[36px] text-neutral-400 dark:text-neutral-600 animate-bounce">image</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-bold tracking-wider uppercase">Loading...</span>
                    </div>
                  )}
                  <img
                    src={review.imageUrl}
                    alt="Customer Chat Feedback Screenshot"
                    className={`object-cover w-full h-full transition-all duration-700 ease-in-out ${
                      loadedImages[`${review.id}-${index}`] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    loading="lazy"
                    onLoad={() => setLoadedImages((prev) => ({ ...prev, [`${review.id}-${index}`]: true }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Social Proof Badge */}
        <div className="flex justify-center pt-2 px-6">
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-full shadow-sm text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span>Thousands of customers trust our product quality & service</span>
          </div>
        </div>

      </div>
    </section>
  );
}
