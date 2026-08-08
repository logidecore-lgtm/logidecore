'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

export default function Header({ user }: { user?: any }) {
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Active check helper
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Close suggestions if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white border-b border-outline-variant/30 sticky top-0 z-50 animate-in fade-in duration-300">
      {/* Top Bar with Search & Logo */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-4 flex items-center justify-between">
        {/* Logo Left - Exact branding match height */}
        <div className="flex-1 flex justify-start">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Logidecore Logo"
              className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                // If logo.png doesn't exist, show clean fallback text
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('logo-text-fallback');
                if (textFallback) textFallback.style.display = 'block';
              }}
            />
            <span id="logo-text-fallback" className="hidden font-serif text-3xl font-medium tracking-tighter text-primary">
              Logidecore
            </span>
          </Link>
        </div>

        {/* Search Bar Middle */}
        <div ref={suggestionsRef} className="flex-[2] hidden md:flex justify-center relative">
          <form action="/search" method="GET" className="flex w-full max-w-md border border-outline-variant/50 rounded overflow-hidden bg-white focus-within:ring-2 focus-within:ring-secondary/20">
            <input
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="flex-grow px-4 py-2 text-sm outline-none border-none focus:ring-0"
              placeholder="Search our store"
              type="text"
            />
            <button type="submit" className="bg-primary hover:bg-secondary text-white px-4 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-white border border-outline-variant/30 rounded w-full max-w-md shadow-2xl p-6 z-50 text-xs font-sans space-y-4 animate-in slide-in-from-top-2 duration-200">
              <p className="text-on-surface-variant/50 font-bold uppercase tracking-wider text-[10px]">
                Popular Searches
              </p>
              <div className="flex flex-col gap-3 font-semibold text-primary">
                <Link
                  href="/category/acrylic-photo-frames"
                  onClick={() => setShowSuggestions(false)}
                  className="hover:text-secondary flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40">search</span>
                  Acrylic Photo Frames
                </Link>
                <Link
                  href="/category/house-name-plates"
                  onClick={() => setShowSuggestions(false)}
                  className="hover:text-secondary flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40">search</span>
                  House Name Plates
                </Link>
                <Link
                  href="/category/car-interior"
                  onClick={() => setShowSuggestions(false)}
                  className="hover:text-secondary flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40">search</span>
                  Car Interior Frames
                </Link>
                <Link
                  href="/category/uv-frames"
                  onClick={() => setShowSuggestions(false)}
                  className="hover:text-secondary flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40">search</span>
                  UV Printed Frames
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Icons Right */}
        <div className="flex-1 flex justify-end items-center space-x-6">
          <Link href={user ? "/dashboard" : "/login"} className="hidden md:inline-flex text-primary hover:text-secondary transition-colors" title="Account">
            <span className="material-symbols-outlined">person</span>
          </Link>

          <Link href="/wishlist" className="hidden md:inline-flex text-primary hover:text-secondary transition-colors relative" title="Wishlist">
            <span className="material-symbols-outlined">favorite</span>
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-scale-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="hidden md:inline-flex text-primary hover:text-secondary transition-colors relative" title="Shopping Bag">
            <span className="material-symbols-outlined">shopping_bag</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-scale-in">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-primary focus:outline-none"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Main Navigation (Desktop) */}
      <nav className="border-t border-outline-variant/10 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-20 py-4">
          <ul className="flex justify-center space-x-10">
            <li>
              <Link
                href="/"
                className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all ${isActive('/')
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/category/all"
                className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all ${isActive('/category/all')
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/category/uv-frames"
                className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all ${isActive('/category/uv-frames')
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
              >
                UV Frames
              </Link>
            </li>
            <li>
              <Link
                href="/category/acrylic-logo-mounts"
                className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all ${isActive('/category/acrylic-logo-mounts')
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
              >
                Business
              </Link>
            </li>
            <li>
              <Link
                href="/order/track"
                className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all ${isActive('/order/track')
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
              >
                Order Status
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className={`font-sans text-xs uppercase tracking-widest pb-1 transition-all ${isActive('/blogs')
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Slide-out Sidebar Drawer for Mobile & Tablet */}
      <div
        className={`fixed inset-0 z-[99999] bg-black/60 transition-opacity duration-300 flex justify-start pointer-events-auto ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`w-80 max-w-[85vw] h-full bg-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="font-serif text-xl font-bold tracking-tight text-primary">Logidecore Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-primary hover:text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Mobile Search input */}
            <form action="/search" method="GET" className="flex border border-outline-variant/60 rounded overflow-hidden">
              <input
                name="q"
                className="flex-grow px-3 py-2 text-xs outline-none"
                placeholder="Search catalog..."
                type="text"
              />
              <button type="submit" className="bg-primary text-white px-3 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">search</span>
              </button>
            </form>

            {/* Nav list */}
            <nav className="pt-2">
              <ul className="flex flex-col space-y-4 font-sans text-xs uppercase tracking-widest font-bold">
                <li>
                  <Link href="/" className={isActive('/') ? 'text-secondary' : 'text-primary'}>Home</Link>
                </li>
                <li>
                  <Link href="/category/all" className={isActive('/category/all') ? 'text-secondary' : 'text-primary'}>All Products</Link>
                </li>
                <li>
                  <Link href="/category/uv-frames" className={isActive('/category/uv-frames') ? 'text-secondary' : 'text-primary'}>UV Frames</Link>
                </li>
                <li>
                  <Link href="/category/acrylic-logo-mounts" className={isActive('/category/acrylic-logo-mounts') ? 'text-secondary' : 'text-primary'}>Business</Link>
                </li>
                <li>
                  <Link href="/order/track" className={isActive('/order/track') ? 'text-secondary' : 'text-primary'}>Order Status</Link>
                </li>
                <li>
                  <Link href="/blogs" className={isActive('/blogs') ? 'text-secondary' : 'text-primary'}>Blogs</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Drawer Footer Actions */}
          <div className="border-t pt-4 space-y-4 text-xs font-sans font-semibold">
            <Link href={user ? "/dashboard" : "/login"} className="flex items-center gap-3 text-primary hover:text-secondary">
              <span className="material-symbols-outlined text-[18px]">person</span>
              {user ? 'My Studio Account' : 'Sign In / Register'}
            </Link>
            <Link href="/wishlist" className="flex items-center gap-3 text-primary hover:text-secondary">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              Wishlist ({wishlistCount})
            </Link>
            <Link href="/cart" className="flex items-center gap-3 text-primary hover:text-secondary">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              Shopping Cart ({cartCount})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
