import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import Analytics from '@/components/common/Analytics';
import SplashScreen from '@/components/common/SplashScreen';
import PageTransition from '@/components/common/PageTransition';

export const metadata: Metadata = {
  title: 'Logidecore | Luxury Bespoke Decor & Photography',
  description: 'Elevating interiors through the art of bespoke photography and high-end decorative mounts.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full">
      <head>
        {/* Load Material Symbols Outlined stylesheet synchronously in head to prevent alt text flashing */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body className="bg-background text-on-background font-sans selection:bg-secondary/30 min-h-full flex flex-col antialiased">
        <SplashScreen />
        <PageTransition />
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
