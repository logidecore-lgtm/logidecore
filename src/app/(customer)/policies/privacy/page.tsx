import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-8 font-sans">
      <header className="border-b border-outline-variant/30 pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Logidecore Studio Policies
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Privacy Policy
        </h1>
      </header>

      <article className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p><strong>Effective Date: July 11, 2026</strong></p>
        <p>
          At Logidecore, we value the trust you place in us. This Privacy Policy describes how we collect, use, disclose, and protect your information when you visit our website logidecore.com and purchase premium custom frames or bespoke name plates.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">1. Information We Collect</h3>
        <p>
          We collect personal identification information including but not limited to full name, billing/shipping address, email address, telephone number, custom texts or quotes, and high-resolution photo uploads for personalized processing.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">2. Cookies and Tracking</h3>
        <p>
          We use session tracking technologies, Google Analytics, and Microsoft Clarity heatmaps to analyze customer retention, rage clicks, and cart activity.
        </p>

        <h3 className="font-serif text-lg font-bold text-primary pt-4">3. Contact Us</h3>
        <p>
          For privacy concerns or query inquiries, email us at <span className="text-secondary font-bold">privacy@logidecore.com</span>.
        </p>
      </article>
    </div>
  );
}
