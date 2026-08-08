'use client';

import React from 'react';

// Helper component to render SVG-based scalloped borders
const ScallopBorder = ({ position = 'top', colorClass = 'text-blue-50 dark:text-neutral-900' }: { position?: 'top' | 'bottom'; colorClass?: string }) => {
  return (
    <div className={`absolute left-0 right-0 h-4 overflow-hidden pointer-events-none z-20 ${position === 'top' ? 'top-0 -translate-y-px' : 'bottom-0 translate-y-px rotate-180'}`}>
      <svg className={`w-full h-full fill-current ${colorClass}`} preserveAspectRatio="none" viewBox="0 0 1440 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 24c40 0 40-20 80-20s40 20 80 20 40-20 80-20 40 20 80 20 40-20 80-20 40 20 80 20 40-20 80-20 40 20 80 20 40-20 80-20 40 20 80 20 40-20 80-20 40 20 80 20 40-20 80-20 40 20 80 20 40-20 80-20 40 20 85 20s40-20 80-20v24z" />
      </svg>
    </div>
  );
};

export default function TrustBadgesSection() {
  return (
    <div className="w-full">
      
      {/* SECTION 1: THE LOGIDECORE CUSTOMIZATION JOURNEY */}
      <section className="relative py-20 bg-blue-50/70 dark:bg-neutral-900/40 overflow-hidden font-sans">
        <ScallopBorder position="top" colorClass="text-white dark:text-neutral-950" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                The Logidecore Customization Journey
              </h2>
            </div>
            <div>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
                From your camera roll to your living room wall. See how easy it is to turn your favorite memories into premium acrylic art.
              </p>
            </div>
          </div>

          {/* Scalloped Inside Steps Container */}
          <div className="relative py-12 px-8 rounded-2xl bg-blue-100/40 dark:bg-neutral-850 border border-blue-200/40 dark:border-neutral-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-blue-200/50 dark:divide-neutral-800 animate-in fade-in duration-300">
              
              {/* Step 1 */}
              <div className="flex flex-col space-y-4 pt-6 md:pt-0 md:px-6 first:pt-0">
                <span className="inline-block self-start px-3 py-1 bg-white dark:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-xs">
                  Step 1
                </span>
                <h3 className="font-serif text-xl font-bold text-primary">
                  Choose Your Canvas
                </h3>
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Browse our collection of premium acrylic photo frames, custom house name plates, and designer collage templates.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col space-y-4 pt-6 md:pt-0 md:px-6">
                <span className="inline-block self-start px-3 py-1 bg-white dark:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-xs">
                  Step 2
                </span>
                <h3 className="font-serif text-xl font-bold text-primary">
                  Upload Your Magic
                </h3>
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Upload your favorite high-quality photos and add any custom text. Our expert design team preps your image for a flawless print.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col space-y-4 pt-6 md:pt-0 md:px-6">
                <span className="inline-block self-start px-3 py-1 bg-white dark:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-xs">
                  Step 3
                </span>
                <h3 className="font-serif text-xl font-bold text-primary">
                  Precision Crafting
                </h3>
                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  We use vibrant, fade-resistant UV printing on shatterproof acrylic to ensure your customized piece looks stunning and lasts a lifetime.
                </p>
              </div>

            </div>
          </div>
        </div>

        <ScallopBorder position="bottom" colorClass="text-blue-50 dark:text-neutral-900/40" />
      </section>

      {/* SECTION 2: OCCASION GIFT GRADIENT BANNER */}
      <section className="relative py-24 bg-gradient-to-r from-[#4A5E73] to-[#2B3E50] text-white text-center font-sans overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_80%)] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 space-y-12">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              One Perfect Gift. For Every Occasion. Every Time.
            </h2>
            <p className="text-sm md:text-base text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Because the best gifts don't come off a shelf—they are custom-made with love, just for the people who matter most to you.
            </p>
          </div>

          {/* Social Proof Tags Row */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-12 justify-center items-center font-semibold text-xs uppercase tracking-widest text-neutral-200">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">💎</span>
              <span>100% Quality Promise</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px]">✈️</span>
              <span>Free Delivery ₹499+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px]">🔄</span>
              <span>Hassle-Free Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRUST BADGES & INDICATORS */}
      <section className="relative py-20 bg-white dark:bg-neutral-950 overflow-hidden font-sans border-b border-neutral-100 dark:border-neutral-900">
        <ScallopBorder position="top" colorClass="text-[#4A5E73]" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10 space-y-16">
          
          {/* Badge Icons Circle List */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            
            {/* Badge 1: Personalized Design */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-neutral-900 border border-blue-100 dark:border-neutral-800 flex items-center justify-center shadow-inner group">
                <span className="material-symbols-outlined text-[36px] text-amber-600 dark:text-amber-500 animate-pulse">brush</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-primary">Personalized Design</h3>
                <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-normal">
                  From photos to names, customize every detail. We turn your unique ideas into stunning acrylic reality.
                </p>
              </div>
            </div>

            {/* Badge 2: Make in India */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-50/50 dark:bg-neutral-900 border border-emerald-100 dark:border-neutral-800 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[36px] text-emerald-600 dark:text-emerald-500">public</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-primary">Make in India</h3>
                <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-normal">
                  Every piece is handcrafted with love in our local facility, supporting Indian artisans and exceptional durability.
                </p>
              </div>
            </div>

            {/* Badge 3: Crystal Clear Quality */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-50/40 dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[36px] text-amber-600 dark:text-amber-500">diamond</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-primary">Crystal Clear Quality</h3>
                <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-normal">
                  Quality you can feel. Precision-cut and inspected. Using premium materials, we guarantee a vibrant finish.
                </p>
              </div>
            </div>

            {/* Badge 4: Pan India Delivery */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50/50 dark:bg-neutral-900 border border-rose-100 dark:border-neutral-800 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[36px] text-rose-600 dark:text-rose-500">map</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-primary">Pan India Delivery</h3>
                <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto leading-normal">
                  We deliver happiness to every corner of India, covering 20,000+ pincodes. Enjoy secure shipping directly to your doorstep.
                </p>
              </div>
            </div>

          </div>

          {/* Under Badges Info Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-neutral-100 dark:border-neutral-900 text-left">
            
            {/* Info 1 */}
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-[24px] text-red-500 mt-0.5">star</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Premium Quality
                </h4>
                <p className="text-[10px] text-neutral-500">High-grade materials built to last.</p>
              </div>
            </div>

            {/* Info 2 */}
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-[24px] text-orange-500 mt-0.5">local_shipping</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Fast & Safe Shipping
                </h4>
                <p className="text-[10px] text-neutral-500">Carefully packaged for secure delivery.</p>
              </div>
            </div>

            {/* Info 3 */}
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-[24px] text-emerald-500 mt-0.5">lock</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  100% Secure Checkout
                </h4>
                <p className="text-[10px] text-neutral-500">Your payments are safe and encrypted.</p>
              </div>
            </div>

            {/* Info 4 */}
            <div className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-[24px] text-blue-500 mt-0.5">headset_mic</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Dedicated Support
                </h4>
                <p className="text-[10px] text-neutral-500">We are here to help with your orders.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
