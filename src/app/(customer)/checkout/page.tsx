'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCart();
  const { subtotal, discount, gst, shipping, total } = getTotals();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [processing, setProcessing] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !street || !city || !stateName || !postalCode) {
      alert('Please fill out all address fields.');
      return;
    }

    setProcessing(true);

    // Simulate database order creation and payment API delay
    setTimeout(() => {
      const orderId = `LD-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setProcessing(false);
      router.push(`/order/success?id=${orderId}`);
    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      <header className="mb-12 border-b border-outline-variant/20 pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-primary">
          Secure Checkout
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-sans text-sm text-on-surface-variant mb-6">
            You don't have any items to check out.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-primary text-white text-xs uppercase tracking-widest font-bold"
          >
            Go Home
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Billing & Shipping Address Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-primary border-b border-outline-variant/20 pb-2">
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Receiver's Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="Receiver Name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="+91-99999-99999"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                  Street Address
                </label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                  placeholder="Suite, House Number, Block, Area"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="New Delhi"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    State
                  </label>
                  <input
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="Delhi"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Postal Code
                  </label>
                  <input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="110001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-6 pt-4">
              <h2 className="font-serif text-2xl font-bold text-primary border-b border-outline-variant/20 pb-2">
                Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-6 border text-left rounded-sm font-sans transition-all flex flex-col justify-between h-28 ${
                    paymentMethod === 'COD'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant/50 text-on-surface-variant hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-widest">Cash on Delivery</p>
                    <p className="text-[10px] opacity-75 mt-0.5">Pay in cash upon delivery at your door step.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-6 border text-left rounded-sm font-sans transition-all flex flex-col justify-between h-28 ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant/50 text-on-surface-variant hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">credit_card</span>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-widest">Razorpay Credit Card/UPI</p>
                    <p className="text-[10px] opacity-75 mt-0.5">Secure payment via credit card, netbanking, or UPI.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-sans text-xs uppercase tracking-widest transition-all flex items-center justify-center font-bold"
            >
              {processing ? 'Processing Order...' : `Complete Purchase (Rs. ${total.toLocaleString('en-IN')}.00)`}
            </button>
          </form>

          {/* Right Column: Summary Display */}
          <div className="space-y-6 lg:border-l lg:border-outline-variant/20 lg:pl-16">
            <h2 className="font-serif text-2xl font-bold border-b border-outline-variant/20 pb-4">
              Your Studio Order
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-surface-container-low border border-outline-variant/30 overflow-hidden shrink-0 rounded-sm">
                    <img
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      src={item.customImageUrl || item.product.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-serif text-sm font-bold text-primary truncate">
                      {item.product.name}
                    </h4>
                    <p className="font-sans text-[10px] uppercase text-on-surface-variant font-semibold">
                      Qty: {item.quantity} {item.variant ? `• Size: ${item.variant.size}` : ''}
                    </p>
                  </div>
                  <span className="font-sans text-xs font-bold text-primary shrink-0">
                    Rs. {((Number(item.product.price) + (item.variant?.priceOffset || 0)) * item.quantity).toLocaleString('en-IN')}.00
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/20 pt-6 space-y-3 font-sans text-xs font-semibold">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Discount</span>
                  <span>- Rs. {discount.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>GST (18% inclusive)</span>
                <span>Rs. {gst.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}.00`}</span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between font-sans text-sm font-bold text-primary">
                <span>Grand Total</span>
                <span>Rs. {total.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
