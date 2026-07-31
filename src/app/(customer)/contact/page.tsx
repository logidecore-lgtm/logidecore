'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    
    // Simulate support ticket creation
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      <header className="mb-16 border-b border-outline-variant/20 pb-8 text-center md:text-left">
        <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Contact Our Studio
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Contact Info Details */}
        <div className="lg:col-span-1 space-y-10 font-sans">
          <div className="space-y-2">
            <h4 className="font-serif text-xl font-bold text-primary">Logidecore Corporate Office</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              12, Connaught Place, Block E, New Delhi, Delhi 110001, India
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-xl font-bold text-primary">Email Support</h4>
            <p className="text-sm text-secondary font-bold">
              studio@logidecore.com
            </p>
            <p className="text-[11px] text-on-surface-variant/70">
              Response time within 24 business hours.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-xl font-bold text-primary">WhatsApp & Telephone</h4>
            <p className="text-sm text-secondary font-bold">
              +91-99999-99999
            </p>
            <p className="text-[11px] text-on-surface-variant/70">
              Mon - Sat: 9:00 AM to 6:00 PM IST
            </p>
          </div>
        </div>

        {/* Interactive Support Ticket / Contact Form */}
        <div className="lg:col-span-2 bg-white border border-outline-variant/30 p-8 rounded-sm shadow-sm">
          <h2 className="font-serif text-2xl font-bold border-b border-outline-variant/20 pb-4 mb-6">
            Create Support Ticket
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-secondary/15 border-l-4 border-secondary text-secondary text-xs font-sans font-bold uppercase tracking-wider animate-in fade-in duration-300">
              ✓ Ticket successfully created! Our support agents will contact you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                  Your Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                  placeholder="E.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                  placeholder="name@domain.com"
                  type="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm"
                placeholder="Order Delay, Product Consultation, Custom Request"
                required
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                Detailed Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-b border-primary bg-transparent py-3 focus:outline-none focus:border-secondary transition-colors text-sm min-h-[120px] resize-none"
                placeholder="Please detail your request..."
                required
              />
            </div>

            <button
              type="submit"
              className="px-10 py-5 bg-primary hover:bg-secondary text-white font-sans text-xs uppercase tracking-widest transition-all font-bold"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
