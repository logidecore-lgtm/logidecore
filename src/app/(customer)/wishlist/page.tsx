'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';

export default function WishlistPage() {
  const { items, toggleItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleShareWishlist = () => {
    // Copy a simulated share link to clipboard
    const simulatedLink = `${window.location.origin}/wishlist/share-simulation`;
    navigator.clipboard.writeText(simulatedLink);
    alert('Wishlist link copied to clipboard! Share it with friends.');
  };

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      quantity: 1,
      product: {
        name: item.name,
        slug: item.slug,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        imageUrl: item.imageUrl,
        sku: `ACRY-WISH-${item.productId}`,
      },
    });
    // Remove from wishlist once added to cart for smoother UX
    toggleItem(item);
  };

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      {/* Title block */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-outline-variant/20 pb-8">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
            Curated Collection
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
            Your Wishlist
          </h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-xl leading-relaxed">
            A personal sanctuary of inspiration. Save your favorite pieces and curate your future space with Logidecore's exclusive boutique selections.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={handleShareWishlist}
              className="px-6 py-4 border border-outline-variant/50 text-xs font-sans font-bold uppercase tracking-widest hover:border-primary transition-all flex items-center gap-2 bg-white"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              Share Wishlist
            </button>
            <button
              onClick={clearWishlist}
              className="px-6 py-4 border border-red-200 text-red-600 text-xs font-sans font-bold uppercase tracking-widest hover:bg-red-50 transition-all bg-white"
            >
              Clear All
            </button>
          </div>
        )}
      </header>

      {/* Grid of Wishlist products */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-outline-variant/30 rounded-sm">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">
            favorite
          </span>
          <h3 className="font-serif text-2xl mb-2">Your wishlist is empty</h3>
          <p className="font-sans text-sm text-on-surface-variant max-w-sm mx-auto mb-8 leading-relaxed">
            Find premium mounts and photo frames on our product catalogue to build your dream space.
          </p>
          <Link
            href="/category/all"
            className="px-10 py-5 bg-primary hover:bg-primary/95 text-white font-sans text-xs uppercase tracking-widest font-bold"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group bg-white border border-outline-variant/20 rounded-sm overflow-hidden flex flex-col justify-between relative"
            >
              {/* Close Button */}
              <button
                onClick={() => toggleItem(item)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white border border-outline-variant/30 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary shadow transition-all"
                title="Remove Item"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>

              {/* Product Image */}
              <div className="aspect-[4/3] overflow-hidden bg-surface-container-low relative">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'}
                />
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
                    Premium Mount
                  </span>
                  <span className="font-sans text-xs text-primary font-bold">
                    Rs. {item.price.toLocaleString('en-IN')}.00
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-bold mb-4 line-clamp-1 group-hover:text-secondary transition-colors">
                  <Link href={`/product/${item.slug}`}>{item.name}</Link>
                </h3>

                {/* Add To Cart */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full py-4 bg-primary text-white font-sans text-xs uppercase tracking-widest hover:bg-secondary transition-all font-bold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
