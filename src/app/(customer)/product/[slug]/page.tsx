'use client';

import React, { useState, useMemo, use, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { compressImage } from '@/lib/image-utils';
import FramePreview from '@/components/product/FramePreview';
import ProductCustomizerModal from '@/components/product/ProductCustomizerModal';

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

  // Customization studio states
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [customization, setCustomization] = useState<{
    imageUrl: string;
    zoom: number;
    rotation: number;
    flipX: boolean;
    flipY: boolean;
    translateX: number;
    translateY: number;
    frameStyle: 'gold' | 'black' | 'oak' | 'silver' | 'template';
    matSize: 'none' | 'thin' | 'wide';
    customText: string;
  } | null>(null);

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

      const isTemplateProduct = !!(
        product?.category?.slug?.toLowerCase().includes('template') ||
        product?.category?.name?.toLowerCase().includes('template') ||
        product?.category?.slug?.toLowerCase().includes('anniversary') ||
        product?.category?.name?.toLowerCase().includes('anniversary') ||
        product?.category?.slug?.toLowerCase().includes('birthday') ||
        product?.category?.name?.toLowerCase().includes('birthday') ||
        product?.category?.slug?.toLowerCase().includes('collage') ||
        product?.category?.name?.toLowerCase().includes('collage')
      );

      const defaultFrameStyle = isTemplateProduct ? 'template' : 'gold';

      setUploadedImage(data.url);
      setCustomization({
        imageUrl: data.url,
        zoom: 1,
        rotation: 0,
        flipX: false,
        flipY: false,
        translateX: 0,
        translateY: 0,
        frameStyle: defaultFrameStyle,
        matSize: defaultFrameStyle === 'template' ? 'none' : 'wide',
        customText: customText,
      });
      setCustomizerOpen(true);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const finalCustomText = customization
      ? `[Frame: ${customization.frameStyle.toUpperCase()}, Mat: ${customization.matSize.toUpperCase()}]${customization.customText ? ` "${customization.customText}"` : ''}`
      : customText;

    addItem({
      productId: product.id,
      productVariantId: activeVariant?.id || 'default',
      quantity,
      customText: finalCustomText,
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
          <div className="aspect-square bg-surface-container-low border border-outline-variant/30 overflow-hidden relative group rounded-sm flex items-center justify-center">
            {activeImage === uploadedImage && customization ? (
              <div className="w-full h-full flex items-center justify-center bg-neutral-900/5">
                <FramePreview
                  imageUrl={customization.imageUrl}
                  templateUrl={product.images?.[0]?.imageUrl || ''}
                  zoom={customization.zoom}
                  rotation={customization.rotation}
                  flipX={customization.flipX}
                  flipY={customization.flipY}
                  translateX={customization.translateX}
                  translateY={customization.translateY}
                  frameStyle={customization.frameStyle}
                  matSize={customization.matSize}
                  customText={customization.customText}
                  isInteractive={false}
                />
              </div>
            ) : activeImage ? (
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
                className={`aspect-square overflow-hidden border bg-surface-container-low rounded-sm transition-all ${activeImage === img.imageUrl ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30 hover:border-primary'
                  }`}
              >
                <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
            {uploadedImage && (
              <button
                onClick={() => setActiveImage(uploadedImage)}
                className={`aspect-square overflow-hidden border bg-surface-container-low rounded-sm transition-all relative flex items-center justify-center ${activeImage === uploadedImage ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30 hover:border-primary'
                  }`}
              >
                <img src={uploadedImage} alt="custom design thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">brush</span>
                </div>
              </button>
            )}
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
                      className={`py-3 px-2 text-center text-xs font-sans font-bold uppercase transition-all rounded-sm border ${selectedSize === size
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
                      className={`py-3 px-6 text-center text-xs font-sans font-bold uppercase transition-all rounded-sm border ${selectedThickness === th
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
              <div
                onClick={() => setCustomizerOpen(true)}
                className="border border-dashed border-outline-variant/80 p-8 rounded-sm text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors relative cursor-pointer"
              >
                {uploading ? (
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider animate-pulse">
                    Uploading your file...
                  </p>
                ) : uploadedImage ? (
                  <div className="space-y-4 flex flex-col items-center justify-center relative z-10 p-2">
                    <div className="h-28 w-28 aspect-square relative border border-outline-variant/35 bg-neutral-900/5 rounded-sm overflow-hidden flex items-center justify-center scale-90">
                      {customization ? (
                        <FramePreview
                          imageUrl={customization.imageUrl}
                          templateUrl={product.images?.[0]?.imageUrl || ''}
                          zoom={customization.zoom}
                          rotation={customization.rotation}
                          flipX={customization.flipX}
                          flipY={customization.flipY}
                          translateX={customization.translateX}
                          translateY={customization.translateY}
                          frameStyle={customization.frameStyle}
                          matSize={customization.matSize}
                          customText={customization.customText}
                          isInteractive={false}
                        />
                      ) : (
                        <img
                          src={uploadedImage}
                          alt="Upload Preview"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">
                      ✓ Custom Design Configured
                    </p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCustomizerOpen(true);
                        }}
                        className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold font-sans rounded-sm cursor-pointer"
                      >
                        Customize Frame
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setUploadedImage(null);
                          setCustomization(null);
                        }}
                        className="px-4 py-2 border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 transition-all text-[10px] uppercase tracking-widest font-bold font-sans rounded-sm cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant/70 mb-2 block">
                      cloud_upload
                    </span>
                    <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
                      Try your photo in this frame
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-semibold">Try Now</p>
                  </>
                )}
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
              className={`w-[54px] h-[54px] border border-outline-variant/50 flex items-center justify-center rounded-sm hover:border-primary transition-all ${isWishlisted ? 'text-red-500 border-red-500' : 'text-primary'
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

          {/* Shipping & Delivery Information */}
          <div className="border-t border-outline-variant/30 py-6 space-y-4">
            <details className="group cursor-pointer">
              <summary className="flex justify-between items-center text-xs font-sans font-bold uppercase tracking-widest text-primary outline-none">
                Shipping & Delivery
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                  keyboard_arrow_down
                </span>
              </summary>
              <div className="mt-4 space-y-3 pl-1 text-xs font-sans text-on-surface-variant leading-relaxed">
                <p className="font-bold text-green-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  FREE Shipping all over India
                </p>
                <p>Typically dispatched within <strong>2-3 working days</strong> and delivered within <strong>4-6 working days</strong>.</p>
                <p>Shipped through one of our trusted courier partners like DTDC, Delhivery, or Bluedart. Tracking details will be shared with the customer upon dispatch.</p>
                <div className="pt-3 border-t border-outline-variant/20 text-[10px] text-on-surface-variant/75 space-y-0.5">
                  <p><strong>Marketed & Packed by:</strong> Logidecore</p>
                  <p>Pauni, Bhandara, Maharashtra, 441910 India</p>
                  <p><strong>Call us at:</strong> +91-9970376791</p>
                </div>
              </div>
            </details>
          </div>

          {/* Returns & Support Information */}
          <div className="border-t border-outline-variant/30 py-6 space-y-4">
            <details className="group cursor-pointer">
              <summary className="flex justify-between items-center text-xs font-sans font-bold uppercase tracking-widest text-primary outline-none">
                Returns & Support Policy
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                  keyboard_arrow_down
                </span>
              </summary>
              <div className="mt-4 space-y-3 pl-1 text-xs font-sans text-on-surface-variant leading-relaxed">
                <p>Unhappy with what you got? Email us at <a href="mailto:support@logidecore.com" className="underline font-semibold hover:text-primary transition-colors">support@logidecore.com</a> or call us at <strong className="text-primary">+91-9970376791</strong>.</p>
                <p>We will dedicate a Happiness Consultant to resolve your issue within <strong>24 working hours</strong>.</p>
                <p>If you have any problem with your order, you can reach us via online chat or call <strong className="text-primary">9970376791</strong>.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Product Customizer Studio Modal Workspace */}
      {customizerOpen && (() => {
        const isTemplateProduct = !!(
          product?.category?.slug?.toLowerCase().includes('template') ||
          product?.category?.name?.toLowerCase().includes('template') ||
          product?.category?.slug?.toLowerCase().includes('anniversary') ||
          product?.category?.name?.toLowerCase().includes('anniversary') ||
          product?.category?.slug?.toLowerCase().includes('birthday') ||
          product?.category?.name?.toLowerCase().includes('birthday') ||
          product?.category?.slug?.toLowerCase().includes('collage') ||
          product?.category?.name?.toLowerCase().includes('collage')
        );
        const defaultFrameStyle = isTemplateProduct ? 'template' : 'gold';

        return (
          <ProductCustomizerModal
            isOpen={customizerOpen}
            onClose={() => setCustomizerOpen(false)}
            imageUrl={customization?.imageUrl || uploadedImage || ''}
            templateUrl={product.images?.[0]?.imageUrl || ''}
            initialCustomText={customization?.customText ?? customText}
            initialFrameStyle={customization?.frameStyle || defaultFrameStyle}
            initialMatSize={customization?.matSize || (defaultFrameStyle === 'template' ? 'none' : 'wide')}
            initialZoom={customization?.zoom}
            initialRotation={customization?.rotation}
            initialFlipX={customization?.flipX}
            initialFlipY={customization?.flipY}
            initialTranslateX={customization?.translateX}
            initialTranslateY={customization?.translateY}
            onSave={(data) => {
              setCustomization(data);
              setUploadedImage(data.imageUrl);
              setCustomText(data.customText);
              setActiveImage(data.imageUrl); // Set the active gallery view to show the custom design
            }}
          />
        );
      })()}
    </div>
  );
}
