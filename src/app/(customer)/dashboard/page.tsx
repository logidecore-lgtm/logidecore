'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';

const MOCK_ORDERS = [
  {
    id: 'LD-928371',
    date: 'July 10, 2026',
    total: 1498,
    status: 'Personalization Studio',
    items: [
      { name: 'Acrylic Portrait Photo Print (A4)', qty: 1, price: 599 },
      { name: 'Custom UV Printed Frame (A3)', qty: 1, price: 899 }
    ]
  },
  {
    id: 'LD-817293',
    date: 'June 18, 2026',
    total: 349,
    status: 'Delivered',
    items: [
      { name: 'Premium Car Interior Frame', qty: 1, price: 349 }
    ]
  }
];

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Profile forms
  const [profileName, setProfileName] = useState('Luxury Collector');
  const [profileEmail, setProfileEmail] = useState('google.user@example.com');
  const [profilePhone, setProfilePhone] = useState('+91-99999-99999');

  // Addresses
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      type: 'Studio (Work)',
      street: '12, Connaught Place, Block E',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      isDefault: true
    }
  ]);

  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostal, setNewPostal] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) return;
    setAddresses([
      ...addresses,
      {
        id: Math.random().toString(),
        type: 'Secondary Address',
        street: newStreet,
        city: newCity,
        state: 'Delhi',
        postalCode: newPostal,
        isDefault: false
      }
    ]);
    setNewStreet('');
    setNewCity('');
    setNewPostal('');
  };

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      <header className="mb-12 border-b border-outline-variant/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
            Studio Dashboard
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Welcome, {profileName}
          </h1>
        </div>

        <button
          onClick={() => logoutAction()}
          className="px-6 py-3 border border-red-200 text-red-600 text-xs font-sans font-bold uppercase tracking-widest hover:bg-red-50 transition-all bg-white"
        >
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-outline-variant/30 p-6 rounded-sm space-y-2 h-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'orders' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left py-3 px-4 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'profile' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left py-3 px-4 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
              activeTab === 'addresses' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            Addresses
          </button>
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3 bg-white border border-outline-variant/30 p-8 rounded-sm shadow-sm">
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <h2 className="font-serif text-xl font-bold border-b border-outline-variant/20 pb-2">
                Order History
              </h2>

              <div className="space-y-6">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="border border-outline-variant/20 p-6 rounded-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10 pb-3">
                      <div>
                        <span className="font-sans text-xs font-bold text-primary block">
                          Reference: {order.id}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-sans font-semibold">
                        <span className="bg-secondary/15 text-secondary px-3 py-1 rounded font-bold uppercase">
                          {order.status}
                        </span>
                        <Link
                          href={`/order/track?id=${order.id}`}
                          className="text-primary hover:text-secondary underline"
                        >
                          Track Status
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-semibold">
                          <span className="text-on-surface-variant">
                            {item.name} <span className="opacity-60">x {item.qty}</span>
                          </span>
                          <span className="text-primary">Rs. {item.price.toLocaleString('en-IN')}.00</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-outline-variant/10 pt-3 flex justify-between text-sm font-bold font-sans">
                      <span>Total Amount Paid</span>
                      <span className="text-secondary">Rs. {order.total.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className="font-serif text-xl font-bold border-b border-outline-variant/20 pb-2">
                Personal Information
              </h2>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                      Full Name
                    </label>
                    <input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                      Phone Number
                    </label>
                    <input
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Email Address
                  </label>
                  <input
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    disabled
                  />
                  <p className="text-[10px] text-on-surface-variant/60 mt-1">
                    Email cannot be altered because it is associated with your Google/email session.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 bg-primary text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-secondary transition-all"
                  onClick={() => alert('Profile successfully updated!')}
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-8">
              <h2 className="font-serif text-xl font-bold border-b border-outline-variant/20 pb-2">
                Saved Locations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-outline-variant/30 p-6 rounded-sm relative">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold mb-2 block">
                      {addr.type} {addr.isDefault && '• DEFAULT'}
                    </span>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-4">
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <button
                      onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                      className="text-red-500 hover:text-red-700 text-xs font-bold font-sans uppercase tracking-wider"
                    >
                      Delete Location
                    </button>
                  </div>
                ))}
              </div>

              {/* Add address form */}
              <form onSubmit={handleAddAddress} className="border-t border-outline-variant/20 pt-8 space-y-6">
                <h3 className="font-serif text-lg font-bold text-primary">Add New Location</h3>
                
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    Street Address
                  </label>
                  <input
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                    placeholder="E.g. House No. 42, Sector 2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                      City
                    </label>
                    <input
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                      placeholder="New Delhi"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                      Postal Code
                    </label>
                    <input
                      value={newPostal}
                      onChange={(e) => setNewPostal(e.target.value)}
                      className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                      placeholder="110001"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 bg-primary text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-secondary transition-all"
                >
                  Add Location
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
