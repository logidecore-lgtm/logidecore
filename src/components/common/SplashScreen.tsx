'use client';

import React, { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if splash screen was already shown in this browser session
    const hasSplashed = sessionStorage.getItem('logidecore_splashed');
    if (!hasSplashed) {
      setShouldRender(true);
      // Play entrance, hold, then open gates
      const openTimer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);

      // Destroy component from DOM after gate slide animation completes
      const destroyTimer = setTimeout(() => {
        setShouldRender(false);
        sessionStorage.setItem('logidecore_splashed', 'true');
      }, 2800);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(destroyTimer);
      };
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex pointer-events-none select-none overflow-hidden">
      {/* Left Gate Panel */}
      <div
        className={`w-1/2 h-full bg-primary transition-transform duration-[1.6s] cubic-bezier(0.85, 0, 0.15, 1) pointer-events-auto ${
          isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Right Gate Panel */}
      <div
        className={`w-1/2 h-full bg-primary transition-transform duration-[1.6s] cubic-bezier(0.85, 0, 0.15, 1) pointer-events-auto ${
          isOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Middle White Logo Container */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-10 py-6 border border-outline-variant/30 shadow-2xl transition-all duration-[1s] z-[100000] flex flex-col items-center justify-center pointer-events-auto ${
          isOpen ? 'opacity-0 scale-150 rotate-3' : 'opacity-100 scale-100'
        }`}
      >
        <img
          src="/logo.png"
          alt="Logidecore Logo"
          className="h-16 w-auto object-contain mb-2"
          onError={(e) => {
            // Fallback to stylized text if logo.png doesn't exist yet in public folder
            e.currentTarget.style.display = 'none';
            const fallbackText = document.getElementById('splash-logo-fallback');
            if (fallbackText) fallbackText.style.display = 'block';
          }}
        />
        <div id="splash-logo-fallback" className="hidden font-serif text-3xl font-bold tracking-tight text-primary">
          Logidecore
        </div>
        <span className="font-sans text-[8px] uppercase tracking-[0.35em] text-secondary font-bold mt-1">
          Bespoke Personalization
        </span>
      </div>
    </div>
  );
}
