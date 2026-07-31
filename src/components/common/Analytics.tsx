'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views when pathname/searchParams change
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-MOCKTRACKINGID';
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const url = pathname + searchParams.toString();
      (window as any).gtag('config', gaId, {
        page_path: url,
      });
      console.log(`[Google Analytics 4] Pageview tracked: ${url}`);
    }
  }, [pathname, searchParams]);

  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-MOCKTRACKING';
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || 'clarity-mock';

  return (
    <>
      {/* Google Analytics 4 script tag */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* Microsoft Clarity Script tag */}
      <Script
        id="clarity-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${clarityId}");
          `,
        }}
      />
    </>
  );
}
