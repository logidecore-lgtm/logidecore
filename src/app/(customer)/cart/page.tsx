'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const {
    items,
    couponCode,
    discountPercentage,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getTotals,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const { subtotal, discount, gst, shipping, total } = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.toUpperCase().trim();

    if (code === 'WELCOME10') {
      applyCoupon(code, 10);
    } else if (code === 'LUXURY20') {
      applyCoupon(code, 20);
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or LUXURY20.');
    }
  };

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      <header className="mb-12 border-b border-outline-variant/20 pb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Shopping Studio Cart
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-outline-variant/30 rounded-sm">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">
            shopping_bag
          </span>
          <h3 className="font-serif text-2xl mb-2">Your cart is empty</h3>
          <p className="font-sans text-sm text-on-surface-variant max-w-sm mx-auto mb-8 leading-relaxed">
            There are currently no premium items or custom orders in your shopping cart.
          </p>
          <Link
            href="/category/all"
            className="px-10 py-5 bg-primary hover:bg-primary/95 text-white font-sans text-xs uppercase tracking-widest font-bold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-outline-variant/20 rounded-sm items-start sm:items-center relative"
              >
                {/* Delete Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-on-surface-variant/40 hover:text-primary transition-all"
                  title="Remove Item"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                {/* Thumbnail */}
                <div className="w-24 h-24 bg-surface-container-low border border-outline-variant/30 overflow-hidden shrink-0 rounded-sm">
                  <img
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    src={item.customImageUrl || item.product.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'}
                  />
                </div>

                {/* Metadata */}
                <div className="flex-grow space-y-2">
                  <h3 className="font-serif text-lg font-bold text-primary max-w-[90%]">
                    {item.product.name}
                  </h3>
                  
                  {item.variant && (
                    <p className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                      Size: {item.variant.size} • Thickness: {item.variant.thickness}
                    </p>
                  )}

                  {item.customText && (
                    <p className="font-sans text-xs text-secondary font-bold">
                      Custom Quote: "{item.customText}"
                    </p>
                  )}

                  <div className="flex items-center space-x-2 font-sans text-xs">
                    <span className="text-secondary font-bold">
                      Rs. {(Number(item.product.price) + (item.variant?.priceOffset || 0)).toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </div>

                {/* Quantity select & total price */}
                <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t sm:border-none pt-4 sm:pt-0">
                  <div className="flex border border-outline-variant/50 rounded overflow-hidden items-center h-10 px-2 justify-between w-24">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-primary hover:text-secondary px-1 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="font-sans text-xs font-bold text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-primary hover:text-secondary px-1 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-sans text-sm font-bold text-primary w-24 text-right">
                    Rs. {((Number(item.product.price) + (item.variant?.priceOffset || 0)) * item.quantity).toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <div className="p-8 bg-white border border-outline-variant/30 rounded-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold border-b border-outline-variant/20 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 font-sans text-xs font-semibold">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString('en-IN')}.00</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>- Rs. {discount.toLocaleString('en-IN')}.00</span>
                  </div>
                )}

                <div className="flex justify-between text-on-surface-variant">
                  <span>GST (18% inclusive)</span>
                  <span>Rs. {gst.toLocaleString('en-IN')}.00</span>
                </div>

                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping Charges</span>
                  <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}.00`}</span>
                </div>

                <div className="border-t border-outline-variant/20 pt-4 flex justify-between font-sans text-sm font-bold text-primary">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Coupon Form */}
              {couponCode ? (
                <div className="flex justify-between items-center p-3 bg-secondary/15 rounded text-xs font-sans font-bold text-secondary">
                  <span>Coupon {couponCode} Applied</span>
                  <button onClick={removeCoupon} className="hover:underline text-[10px]">
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="border-underlined py-2 flex items-center">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 w-full placeholder:text-on-surface-variant/40 text-xs outline-none"
                      placeholder="ENTER COUPON (WELCOME10)"
                      type="text"
                    />
                    <button className="material-symbols-outlined text-secondary" type="submit">
                      east
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-600 font-bold">{couponError}</p>}
                </form>
              )}

              <Link
                href="/checkout"
                className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-sans text-xs uppercase tracking-widest transition-all flex items-center justify-center font-bold"
              >
                Proceed to Checkout
              </Link>
            </div>
            
            <p className="text-[10px] text-on-surface-variant text-center font-sans">
              Free shipping on orders above Rs. 1,500. Secure 256-bit SSL encrypted checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
