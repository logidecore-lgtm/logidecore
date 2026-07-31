import React from 'react';
import Link from 'next/link';

const FAQS = [
  {
    category: 'Ordering & Customization',
    items: [
      {
        q: 'How do I upload high-resolution images?',
        a: 'On the product details page, click the dashed upload container to browse your device files. We support JPG, PNG, and HEIC files up to 20MB. Our studio calibration experts evaluate every file for color profile match before starting production.'
      },
      {
        q: 'Can I add custom text or logo mounts?',
        a: 'Yes, we specialize in corporate logo mounts and custom house name plates. Enter your text quote in the dedicated input field, or upload corporate SVG files for exact engraving matching.'
      }
    ]
  },
  {
    category: 'Product Specifications',
    items: [
      {
        q: 'What is the difference between 3mm and 5mm thickness?',
        a: '3mm thickness is recommended for table-top frames or smaller A4 wall portraits. 5mm thickness is highly premium, adding substantial depth, rigidity, and float-off-the-wall presence for larger prints and house plates.'
      },
      {
        q: 'Are your acrylic sheets scratch resistant?',
        a: 'Yes. We use premium grade cast acrylic that is treated with a hard scratch-resistant outer shell. However, we recommend cleaning them only with microfiber cloths and avoiding ammonia-based chemical sprays.'
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-4xl mx-auto space-y-12 font-sans">
      <header className="border-b border-outline-variant/30 pb-6 text-center">
        <span className="text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Client Inquiries
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Frequently Answered Questions
        </h1>
      </header>

      <div className="space-y-10">
        {FAQS.map((group, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-secondary border-b border-outline-variant/20 pb-2">
              {group.category}
            </h3>
            
            <div className="space-y-4">
              {group.items.map((item, itemIdx) => (
                <details key={itemIdx} className="group bg-white border border-outline-variant/30 p-5 rounded-sm cursor-pointer">
                  <summary className="flex justify-between items-center text-sm font-bold text-primary outline-none">
                    {item.q}
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary">
                      keyboard_arrow_down
                    </span>
                  </summary>
                  <p className="mt-4 text-xs text-on-surface-variant leading-relaxed pl-1">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8 border-t border-outline-variant/20">
        <p className="text-xs text-on-surface-variant mb-4">Still have unanswered questions?</p>
        <Link
          href="/contact"
          className="px-8 py-4 bg-primary text-white text-xs font-sans font-bold uppercase tracking-widest hover:bg-secondary transition-all inline-block"
        >
          Create Support Ticket
        </Link>
      </div>
    </div>
  );
}
