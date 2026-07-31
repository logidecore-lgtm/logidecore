'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <footer className="bg-surface-container-lowest dark:bg-primary-container border-t border-outline-variant/30 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="font-serif text-2xl text-primary dark:text-primary-fixed mb-8 block">
            Logidecore
          </Link>
          <p className="font-sans text-sm text-on-surface-variant max-w-xs mb-8">
            Elevating interiors through the art of bespoke photography and high-end decorative mounts.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center rounded-full hover:border-secondary hover:text-secondary transition-colors duration-300">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a href="mailto:support@logidecore.com" className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center rounded-full hover:border-secondary hover:text-secondary transition-colors duration-300">
              <span className="material-symbols-outlined text-[20px]">alternate_email</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold mb-2">Company</span>
            <Link href="/policies/privacy" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              Privacy Policy
            </Link>
            <Link href="/policies/terms" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              Terms & Conditions
            </Link>
            <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              About Us
            </Link>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold mb-2">Support</span>
            <Link href="/policies/refund" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              Refund Policy
            </Link>
            <Link href="/policies/shipping" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              Shipping Policy
            </Link>
            <Link href="/faq" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              FAQ
            </Link>
            <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-xs font-semibold uppercase tracking-wider">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold mb-6 block">Subscribe</span>
          <p className="font-sans text-sm text-on-surface-variant mb-6">
            Join our exclusive mailing list for early access to new collections.
          </p>
          {subscribed ? (
            <p className="text-secondary text-sm font-semibold">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-4">
              <div className="border-underlined py-2 flex items-center">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 w-full placeholder:text-on-surface-variant/50 text-sm outline-none"
                  placeholder="Email Address"
                  type="email"
                  required
                />
                <button className="material-symbols-outlined text-secondary" type="submit">
                  east
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-8 border-t border-outline-variant/10 text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-on-surface-variant/50">
          © {new Date().getFullYear()} Logidecore. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
