'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Whenever pathname changes, trigger a quick, premium top progress bar animation
    setLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => {
      setProgress(70);
    }, 200);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 550);

    const timer3 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] h-[3px] bg-neutral-200 pointer-events-none">
      <div
        className="h-full bg-secondary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
