'use client';

import React, { useState, useMemo, use, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { compressImage } from '@/lib/image-utils';

interface ProductImage {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
}

interface ProductVariant {
  id: string;
  size: string;
  thickness: string;
  price: string;
  comparePrice?: string | null;
  sku: string;
}

interface ProductMaterial {
  id: string;
  title: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: string;
  comparePrice?: string | null;
  shortDescription?: string;
  description?: string;
  rating?: string | number;
  reviewCount?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  materials: ProductMaterial[];
  category?: {
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedThickness, setSelectedThickness] = useState<string>('');
  
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addedNotify, setAddedNotify] = useState(false);

  // Zustand stores
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  // Load product details
  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        const images = data.images || [];
        const thumb = images.find((img: any) => img.isThumbnail)?.imageUrl || images[0]?.imageUrl || '';
        setActiveImage(thumb);
        
        // Initialize size & thickness from variants
        const variants = data.variants || [];
        if (variants.length > 0) {
          const sizes = Array.from(new Set(variants.map((v: any) => v.size))) as string[];
          setSelectedSize(sizes[0] || '');
          
          const thicknesses = Array.from(
            new Set(variants.filter((v: any) => v.size === sizes[0]).map((v: any) => v.thickness))
          ) as string[];
          setSelectedThickness(thicknesses[0] || '');
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Update thicknesses when selected size changes
  useEffect(() => {
    if (!product) return;
    const variants = product.variants || [];
    const thicknesses = Array.from(
      new Set(variants.filter((v) => v.size === selectedSize).map((v) => v.thickness))
    );
    if (thicknesses.length > 0 && !thicknesses.includes(selectedThickness)) {
      setSelectedThickness(thicknesses[0]);
    }
  }, [selectedSize, product]);

  // Extract unique sizes from variants
  const availableSizes = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map((v) => v.size)));
  }, [product]);

  // Extract available thicknesses for the selected size
  const availableThicknesses = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Set(product.variants.filter((v) => v.size === selectedSize).map((v) => v.thickness))
    );
  }, [product, selectedSize]);

  // Find active variant matching selected attributes
  const activeVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => v.size === selectedSize && v.thickness === selectedThickness) || null;
  }, [product, selectedSize, selectedThickness]);

  // Pricing calculations
  const price = useMemo(() => {
    if (activeVariant) return parseFloat(activeVariant.price);
    if (product) return parseFloat(product.basePrice);
    return 0;
  }, [product, activeVariant]);

  const comparePrice = useMemo(() => {
    if (activeVariant) return activeVariant.comparePrice ? parseFloat(activeVariant.comparePrice) : null;
    if (product) return product.comparePrice ? parseFloat(product.comparePrice) : null;
    return null;
  }, [product, activeVariant]);

  const discountPercentage = useMemo(() => {
    if (!price || !comparePrice) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  }, [price, comparePrice]);

  // Real image upload to Cloudinary via route
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('folder', 'customer_uploads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      setUploadedImage(data.url);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      productVariantId: activeVariant?.id || 'default',
      quantity,
      customText,
      customImageUrl: uploadedImage,
      product: {
        name: product.name,
        slug: product.slug,
        price: price,
        compareAtPrice: comparePrice || undefined,
        imageUrl: product.images?.[0]?.imageUrl || '',
        sku: activeVariant?.sku || product.sku,
      },
      variant: {
        size: selectedSize,
        thickness: selectedThickness,
        priceOffset: 0, // In driver-based layout, the price is fully set by variant
      },
    });

    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-center px-4">
        <h2 className="font-serif text-3xl font-bold mb-4">Design Not Found</h2>
        <p className="text-sm text-neutral-400 mb-8 max-w-md">
          The requested product design may have been removed or is temporarily unavailable.
        </p>
        <Link href="/" className="px-8 py-4 bg-primary text-white text-xs uppercase tracking-widest font-bold font-sans">
          Back to Studio Home
        </Link>
      </div>
    );
  }

  const isWishlisted = hasItem(product.id);

  return (
    <div className="bg-background min-h-screen py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="font-sans text-xs text-on-surface-variant flex items-center space-x-2 font-semibold mb-12">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/category/${product.category?.slug || 'all'}`} className="hover:text-primary transition-colors">
          {product.category?.name || 'All'}
        </Link>
        <span>/</span>
        <span className="text-primary font-bold">{product.name}</span>
      </nav>

      {/* Main product split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Product Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-surface-container-low border border-outline-variant/30 overflow-hidden relative group rounded-sm">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in"
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-sm font-bold uppercase tracking-wider">
                No image available
              </div>
            )}
            {/* Overlay indicators */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white font-mono text-[10px] px-3 py-1 uppercase rounded-full">
              F/4.0 | 1/160s | ISO 400
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-5 gap-4">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img.imageUrl)}
                className={`aspect-square overflow-hidden border bg-surface-container-low rounded-sm transition-all ${
                  activeImage === img.imageUrl ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30 hover:border-primary'
                }`}
              >
                <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Customization Details */}
        <div className="space-y-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold mb-2 block">
              Curated Collection
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary mb-3">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex text-secondary text-sm">
                {'★'.repeat(5)}
              </div>
              <span className="font-sans text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline space-x-4 mb-4">
              <span className="font-sans text-2xl font-bold text-primary">
                Rs. {price.toLocaleString('en-IN')}.00
              </span>
              {comparePrice && (
                <>
                  <span className="font-sans text-lg text-on-surface-variant/50 line-through">
                    Rs. {comparePrice.toLocaleString('en-IN')}.00
                  </span>
                  {discountPercentage > 0 && (
                    <span className="bg-secondary/10 text-secondary text-xs font-bold font-sans px-2.5 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="border-t border-outline-variant/30 py-6 space-y-6">
            {/* Size selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <label className="block font-sans text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                  Select Size
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-2 text-center text-xs font-sans font-bold uppercase transition-all rounded-sm border ${
                        selectedSize === size
                          ? 'bg-primary text-white border-primary shadow'
                          : 'border-outline-variant/60 hover:border-primary text-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thickness Selector */}
            {availableThicknesses.length > 0 && (
              <div className="space-y-3">
                <label className="block font-sans text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                  Select Thickness
                </label>
                <div className="flex gap-4">
                  {availableThicknesses.map((th) => (
                    <button
                      key={th}
                      onClick={() => setSelectedThickness(th)}
                      className={`py-3 px-6 text-center text-xs font-sans font-bold uppercase transition-all rounded-sm border ${
                        selectedThickness === th
                          ? 'bg-primary text-white border-primary shadow'
                          : 'border-outline-variant/60 hover:border-primary text-primary'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* High-Res Photo Uploader */}
            <div className="space-y-3">
              <label className="block font-sans text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Upload High-Res Photo
              </label>
              <div className="border border-dashed border-outline-variant/80 p-8 rounded-sm text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {uploading ? (
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider animate-pulse">
                    Uploading your file...
                  </p>
                ) : uploadedImage ? (
                  <div className="space-y-3 flex flex-col items-center justify-center relative z-10">
                    <img 
                      src={uploadedImage} 
                      alt="Upload Preview" 
                      className="h-28 w-auto object-contain border border-outline-variant/30 shadow-md"
                    />
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">
                      ✓ Image Uploaded Successfully
                    </p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setUploadedImage(null);
                      }}
                      className="text-red-600 hover:text-red-800 text-[10px] uppercase tracking-widest font-bold font-sans underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant/70 mb-2 block">
                      cloud_upload
                    </span>
                    <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
                      Drop file or click to browse
                    </p>
                    <p className="text-[10px] text-on-surface-variant">JPG, PNG up to 20MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Custom text quote */}
            <div className="space-y-3">
              <label className="block font-sans text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Add Quote / Custom Text
              </label>
              <div className="border-b border-neutral-300 py-2 flex items-center">
                <input
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 w-full placeholder:text-on-surface-variant/40 text-sm outline-none"
                  placeholder="Type your text here..."
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-4 border-t border-outline-variant/30 py-6">
            {/* Quantity Control */}
            <div className="flex border border-outline-variant/50 rounded overflow-hidden h-[54px] w-full sm:w-[130px] items-center justify-between px-3">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="text-primary hover:text-secondary text-lg px-2 font-bold"
              >
                -
              </button>
              <span className="font-sans text-sm font-bold text-primary">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="text-primary hover:text-secondary text-lg px-2 font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-grow h-[54px] bg-primary hover:bg-primary/95 text-white font-sans text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              Add to Cart
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() =>
                toggleItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: price,
                  imageUrl: product.images?.[0]?.imageUrl || '',
                })
              }
              className={`w-[54px] h-[54px] border border-outline-variant/50 flex items-center justify-center rounded-sm hover:border-primary transition-all ${
                isWishlisted ? 'text-red-500 border-red-500' : 'text-primary'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
          </div>

          {addedNotify && (
            <div className="bg-secondary/15 border-l-4 border-secondary p-4 text-xs font-sans text-secondary font-bold uppercase tracking-wider animate-in fade-in duration-300">
              ✓ Item added successfully to your shopping studio cart!
            </div>
          )}

          {/* Collapsible Details Panel */}
          {product.description && (
            <div className="border-t border-outline-variant/30 py-6 space-y-4">
              <details className="group cursor-pointer" open>
                <summary className="flex justify-between items-center text-xs font-sans font-bold uppercase tracking-widest text-primary outline-none">
                  Details & Design Specifications
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                    keyboard_arrow_down
                  </span>
                </summary>
                <p className="mt-4 text-sm text-on-surface-variant font-sans leading-relaxed pl-1 whitespace-pre-line">
                  {product.description}
                </p>
              </details>
            </div>
          )}

          {/* Product Materials Specifications */}
          {product.materials?.length > 0 && (
            <div className="border-t border-outline-variant/30 py-6 space-y-4">
              <details className="group cursor-pointer" open>
                <summary className="flex justify-between items-center text-xs font-sans font-bold uppercase tracking-widest text-primary outline-none">
                  Material Details & Finishing
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                    keyboard_arrow_down
                  </span>
                </summary>
                <div className="mt-4 space-y-4 pl-1 text-sm font-sans">
                  {product.materials.map((m) => (
                    <div key={m.id} className="space-y-0.5">
                      <h4 className="font-bold text-primary">{m.title}</h4>
                      <p className="text-on-surface-variant text-xs leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
