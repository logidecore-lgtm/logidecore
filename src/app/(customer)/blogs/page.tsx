import React from 'react';
import Link from 'next/link';

const MOCK_BLOGS = [
  {
    title: 'How to Choose the Perfect Frame for Minimalist Spaces',
    slug: 'choose-perfect-frame-minimalist',
    summary: 'A complete architectural guide on selection metrics for transparent glassmorphic acrylic frames versus bold matte wood borders.',
    date: 'June 28, 2026',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Designing Luxury Entrances: House Name Plates Edition',
    slug: 'designing-luxury-entrances-plates',
    summary: 'Explore styling tokens, gold metallic typography, and acrylic backing elements to elevate your main entrance aesthetic.',
    date: 'May 14, 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkf8AwkYduWbdHuCK53BYqcBcrP9xSlE9MpOwgO2lci6N5pWA3G_GFbHSoRo2Tn9mBERo1BLdtg0K1cpl6Khf0f6rukRsgLzmz_SQKSrTZbciiupK2nARP63WcBOfqQbVSd2uXWjncqawub_W3pZqcC6siBeZqTgHWTbcscFt20nMVf6Z8RyDoGjR3CgTPHMHRau0BvD3ErmD9inqNyhocYLYD2svEggDTlB6rFmyFf5kXdbqGYYEmKvYc4rrQBK7zLs5WyIVMKRzO',
  }
];

export default function BlogsPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      <header className="mb-16 border-b border-outline-variant/20 pb-8 text-center md:text-left">
        <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
          Editorial Journal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary">
          Logidecore Chronicles
        </h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 font-sans">
        {MOCK_BLOGS.map((blog) => (
          <article key={blog.slug} className="group space-y-3 md:space-y-6">
            <Link href={`/blogs/${blog.slug}`} className="block">
              <div className="aspect-[16/10] overflow-hidden bg-surface-container-low border border-outline-variant/20 rounded-sm">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
            
            <div className="space-y-1.5 md:space-y-3">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-secondary font-bold">
                {blog.date} • Bespoke Design
              </span>
              <h3 className="font-serif text-base md:text-2xl font-bold text-primary group-hover:text-secondary transition-colors leading-snug line-clamp-2">
                <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                {blog.summary}
              </p>
              <Link
                href={`/blogs/${blog.slug}`}
                className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors underline pt-1 md:pt-2"
              >
                Read Article
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
