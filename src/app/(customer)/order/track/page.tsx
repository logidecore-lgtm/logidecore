'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';

const STEPS = [
  { label: 'Order Placed', desc: 'Secure booking confirmed' },
  { label: 'Personalization Studio', desc: 'UV printing & acrylic mounting' },
  { label: 'Quality Inspection', desc: 'Scratch check & finish evaluation' },
  { label: 'Courier Handover', desc: 'Packed in wooden safety crates' },
  { label: 'Delivered', desc: 'Signature handover completed' }
];

export default function OrderTrackingPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedParams = use(searchParams);
  
  const [orderIdInput, setOrderIdInput] = useState(resolvedParams.id || '');
  const [trackedId, setTrackedId] = useState<string | null>(resolvedParams.id || null);
  const [currentMilestone, setCurrentMilestone] = useState(1); // Studio milestone default

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput) return;
    setTrackedId(orderIdInput);
    // Random milestone step for simulation
    setCurrentMilestone(Math.floor(Math.random() * 4) + 1);
  };

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      <header className="mb-12 border-b border-outline-variant/20 pb-6 text-center md:text-left">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-primary">
          Order Status Tracking
        </h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-12">
        {/* Track search form */}
        <form onSubmit={handleTrack} className="bg-white border border-outline-variant/30 p-8 rounded-sm shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-primary">
            Enter Order Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow border-underlined py-2 flex items-center">
              <input
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full placeholder:text-on-surface-variant/40 text-sm outline-none font-sans"
                placeholder="ORDER REFERENCE NUMBER (LD-XXXXXX)"
                type="text"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-primary text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-secondary transition-all"
            >
              Track Order
            </button>
          </div>
        </form>

        {/* Stepper tracking progress */}
        {trackedId && (
          <div className="bg-white border border-outline-variant/30 p-8 rounded-sm shadow-sm space-y-10">
            <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-4">
              <div>
                <span className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block mb-1">
                  Active Reference
                </span>
                <span className="font-sans text-sm font-bold text-primary">{trackedId}</span>
              </div>
              <span className="bg-secondary/15 text-secondary text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                Studio Customizing
              </span>
            </div>

            {/* Vertically stacked timeline stepper */}
            <div className="relative border-l border-outline-variant/50 ml-3 pl-6 space-y-8 py-2">
              {STEPS.map((step, idx) => {
                const isActive = idx <= currentMilestone;
                const isCurrent = idx === currentMilestone;

                return (
                  <div key={idx} className="relative">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-all ${
                        isActive
                          ? 'bg-secondary border-secondary ring-4 ring-secondary/20'
                          : 'bg-white border-outline-variant'
                      }`}
                    />
                    
                    <div className="space-y-1">
                      <h4 className={`font-serif text-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                        {step.label}
                      </h4>
                      <p className={`font-sans text-xs ${isActive ? 'text-on-surface-variant' : 'text-on-surface-variant/30'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
