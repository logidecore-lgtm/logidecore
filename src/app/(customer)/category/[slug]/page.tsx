'use client';

import React, { useState, useMemo, use, useEffect } from 'react';
import Link from 'next/link';
import CustomerReviewsCarousel from '@/components/product/CustomerReviewsCarousel';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  categorySlug: string;
  sizes: string[];
  thickness: string[];
  rating: number;
  createdDate: string;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popularity'>('popularity');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<string | null>(null);

  // Load from API
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: Product[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: parseFloat(p.basePrice),
            compareAtPrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
            image: p.images?.find((img: any) => img.isThumbnail)?.imageUrl || p.images?.[0]?.imageUrl || '',
            categorySlug: p.category?.slug || '',
            sizes: Array.from(new Set(p.variants?.map((v: any) => v.size) || [])),
            thickness: Array.from(new Set(p.variants?.map((v: any) => v.thickness) || [])),
            rating: parseFloat(p.rating) || 4.5,
            createdDate: p.createdAt,
          }));
          setProducts(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load category products:', err);
        setLoading(false);
      });
  }, []);

  // Compute category label
  const categoryLabel = useMemo(() => {
    const clean = slug.replace(/-/g, ' ');
    return clean.toUpperCase();
  }, [slug]);

  // Filter products by category and filters
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Category
    if (slug !== 'all') {
      result = result.filter((p) => p.categorySlug === slug);
    }

    // Filter by Size
    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Filter by Thickness
    if (selectedThickness) {
      result = result.filter((p) => p.thickness.includes(selectedThickness));
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      // Default: popularity by rating
      return b.rating - a.rating;
    });
  }, [products, slug, selectedSize, selectedThickness, sortBy]);

  return (
    <div className="bg-background min-h-screen">
      {/* Category Banner & Breadcrumb */}
      <section className="bg-white border-b border-outline-variant/30 py-12 px-6 md:px-20">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {categoryLabel}
          </h1>
          <nav className="font-sans text-xs text-on-surface-variant flex items-center space-x-2 font-semibold">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary font-bold">{categoryLabel}</span>
          </nav>
        </div>
      </section>

      {/* Filter / Sort Control Bar */}
      <section className="bg-white py-4 border-b border-outline-variant/20 px-6 md:px-20 sticky top-[80px] z-40">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Filters Selection */}
          <div className="flex flex-wrap gap-4 text-xs font-sans font-semibold">
            <select
              value={selectedSize || ''}
              onChange={(e) => setSelectedSize(e.target.value || null)}
              className="border border-outline-variant/50 rounded px-4 py-2 bg-white outline-none"
            >
              <option value="">All Sizes</option>
              <option value='8"x12" (A4)'>8"x12" (A4)</option>
              <option value='12"x18" (A3)'>12"x18" (A3)</option>
              <option value='18"x24" (A2)'>18"x24" (A2)</option>
              <option value="2x3 Feet">2x3 Feet</option>
            </select>

            <select
              value={selectedThickness || ''}
              onChange={(e) => setSelectedThickness(e.target.value || null)}
              className="border border-outline-variant/50 rounded px-4 py-2 bg-white outline-none"
            >
              <option value="">All Thickness</option>
              <option value="3mm">3mm</option>
              <option value="5mm">5mm</option>
            </select>
          </div>

          {/* Sort selection & stats */}
          <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end text-xs font-sans font-bold">
            <span className="text-on-surface-variant font-semibold">
              {filteredProducts.length} Products
            </span>
            <div className="flex items-center space-x-2">
              <span className="uppercase tracking-widest text-on-surface-variant">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="border-none bg-transparent p-0 text-primary font-bold focus:ring-0 outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 block">
              sentiment_dissatisfied
            </span>
            <h3 className="font-serif text-2xl mb-2">No Products Found</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-8 leading-relaxed">
              We couldn't find any products matching your current filters. Try resetting the dropdowns.
            </p>
            <button
              onClick={() => {
                setSelectedSize(null);
                setSelectedThickness(null);
              }}
              className="px-6 py-3 bg-primary text-white text-xs uppercase tracking-widest font-bold font-sans"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white border border-outline-variant/10 rounded-sm overflow-hidden flex flex-col justify-between">
                {/* Sale Tag */}
                {product.compareAtPrice && (
                  <span className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-sans font-bold tracking-widest px-3 py-1.5 uppercase">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% Sale
                  </span>
                )}

                {/* Product Image Panel */}
                <div className="aspect-square relative overflow-hidden bg-surface-container-low border-b">
                  {product.image ? (
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.image}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                      No Image
                    </div>
                  )}
                  {/* Quick Add Overlay on hover */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="absolute inset-x-0 bottom-0 py-4 bg-secondary text-white text-center text-xs uppercase tracking-widest font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    Quick View & Customize
                  </Link>
                </div>

                {/* Product Metadata */}
                <div className="p-6 text-center">
                  <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-secondary transition-colors line-clamp-1">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center justify-center space-x-2 font-sans text-sm">
                    <span className="text-secondary font-bold">Rs. {product.price.toLocaleString('en-IN')}.00</span>
                    {product.compareAtPrice && (
                      <span className="text-on-surface-variant/50 line-through text-xs">
                        Rs. {product.compareAtPrice.toLocaleString('en-IN')}.00
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviewsCarousel categorySlug={slug} />
    </div>
  );
}
