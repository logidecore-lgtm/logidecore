'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { compressImage } from '@/lib/image-utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  id?: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  isThumbnail: boolean;
  sortOrder: number;
  altText?: string;
}

interface ProductVariant {
  id?: string;
  size: string;
  thickness: string;
  price: number | string;
  comparePrice?: number | string | null;
  stock: number;
  sku: string;
}

interface ProductMaterial {
  id?: string;
  title: string;
  description: string;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number | string;
  comparePrice?: number | string | null;
  shortDescription?: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  materials: ProductMaterial[];
  category?: Category;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formBasePrice, setFormBasePrice] = useState('');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Form Nested Arrays
  const [formImages, setFormImages] = useState<ProductImage[]>([]);
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);
  const [formMaterials, setFormMaterials] = useState<ProductMaterial[]>([]);

  // Dynamic Category Creation States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [settingsCategoryName, setSettingsCategoryName] = useState('');
  const [creatingSettingsCategory, setCreatingSettingsCategory] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      setCategories((prev) => [...prev, data]);
      setFormCategoryId(data.id);
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateSettingsCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsCategoryName.trim()) return;
    setCreatingSettingsCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: settingsCategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      setCategories((prev) => [...prev, data]);
      setSettingsCategoryName('');
      alert('Category created successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setCreatingSettingsCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const hasProducts = products.some((p) => p.categoryId === id);
    if (hasProducts) {
      alert("Cannot delete category because it contains active products in the catalogue. Please reassign or delete the products first.");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (formCategoryId === id) {
        setFormCategoryId(categories.filter((c) => c.id !== id)[0]?.id || '');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  // Temp item states for nested array adding
  const [tempVariantSize, setTempVariantSize] = useState('');
  const [tempVariantThickness, setTempVariantThickness] = useState('');
  const [tempVariantPrice, setTempVariantPrice] = useState('');
  const [tempVariantComparePrice, setTempVariantComparePrice] = useState('');
  const [tempVariantStock, setTempVariantStock] = useState('100');
  const [tempVariantSku, setTempVariantSku] = useState('');

  const [tempMaterialTitle, setTempMaterialTitle] = useState('');
  const [tempMaterialDescription, setTempMaterialDescription] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');

  // 1. Authenticate and Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError('');
      // Fetch Products
      const prodRes = await fetch('/api/admin/products');
      if (prodRes.status === 401) {
        router.push('/admin/login');
        return;
      }
      
      const prods = await prodRes.json();
      if (Array.isArray(prods)) {
        setProducts(prods);
      } else {
        throw new Error(prods.error || 'Failed to retrieve products list.');
      }

      // Fetch Categories
      const catRes = await fetch('/api/categories');
      const cats = await catRes.json();
      if (Array.isArray(cats)) {
        setCategories(cats);
      } else {
        throw new Error(cats.error || 'Failed to retrieve categories list.');
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setLoadError(err.message || 'Connection to Neon database failed. Please verify that the database server is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-generate slug and variant SKUs
  useEffect(() => {
    if (!editingProduct && formName) {
      const generatedSlug = formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generatedSlug);
    }
  }, [formName, editingProduct]);

  // 2. Form Open/Edit Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormSku('');
    setFormCategoryId(categories[0]?.id || '');
    setFormBasePrice('');
    setFormComparePrice('');
    setFormShortDescription('');
    setFormDescription('');
    setFormIsActive(true);
    setFormIsFeatured(false);
    setFormImages([]);
    setFormVariants([]);
    setFormMaterials([]);
    setFormError('');
    setShowNewCategoryInput(false);
    setNewCategoryName('');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormSku(product.sku);
    setFormCategoryId(product.categoryId);
    setFormBasePrice(product.basePrice.toString());
    setFormComparePrice(product.comparePrice?.toString() || '');
    setFormShortDescription(product.shortDescription || '');
    setFormDescription(product.description || '');
    setFormIsActive(product.isActive);
    setFormIsFeatured(product.isFeatured);
    
    // Copy arrays to prevent reference mutating
    setFormImages(product.images.map(img => ({ ...img })));
    setFormVariants(product.variants.map(v => ({ ...v })));
    setFormMaterials(product.materials.map(m => ({ ...m })));
    setFormError('');
    setShowNewCategoryInput(false);
    setNewCategoryName('');
    setShowFormModal(true);
  };

  // 3. Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('folder', 'products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');

      const isFirst = formImages.length === 0;
      const newImage: ProductImage = {
        imageUrl: data.url,
        cloudinaryPublicId: data.publicId,
        isThumbnail: isFirst,
        sortOrder: formImages.length,
        altText: `${formName || 'Product'} Image ${formImages.length + 1}`,
      };

      setFormImages([...formImages, newImage]);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = formImages.filter((_, idx) => idx !== index);
    // Re-assign thumbnails if removed
    if (formImages[index].isThumbnail && updated.length > 0) {
      updated[0].isThumbnail = true;
    }
    // Update sort order
    const reordered = updated.map((img, idx) => ({ ...img, sortOrder: idx }));
    setFormImages(reordered);
  };

  // 4. Nested Arrays Adding Handlers
  const addVariant = () => {
    if (!tempVariantSize || !tempVariantPrice || !tempVariantSku) {
      alert('Size, Price and SKU are required for variants');
      return;
    }

    const newVariant: ProductVariant = {
      size: tempVariantSize,
      thickness: tempVariantThickness || '3mm',
      price: parseFloat(tempVariantPrice),
      comparePrice: tempVariantComparePrice ? parseFloat(tempVariantComparePrice) : null,
      stock: parseInt(tempVariantStock) || 0,
      sku: tempVariantSku,
    };

    setFormVariants([...formVariants, newVariant]);
    setTempVariantSize('');
    setTempVariantThickness('');
    setTempVariantPrice('');
    setTempVariantComparePrice('');
    setTempVariantSku('');
  };

  const removeVariant = (index: number) => {
    setFormVariants(formVariants.filter((_, idx) => idx !== index));
  };

  const addMaterial = () => {
    if (!tempMaterialTitle) {
      alert('Material title is required');
      return;
    }

    const newMaterial: ProductMaterial = {
      title: tempMaterialTitle,
      description: tempMaterialDescription,
    };

    setFormMaterials([...formMaterials, newMaterial]);
    setTempMaterialTitle('');
    setTempMaterialDescription('');
  };

  const removeMaterial = (index: number) => {
    setFormMaterials(formMaterials.filter((_, idx) => idx !== index));
  };

  // 5. Submit CRUD Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formCategoryId) {
      setFormError('Please select a Category');
      return;
    }

    const payload = {
      categoryId: formCategoryId,
      name: formName,
      slug: formSlug,
      sku: formSku,
      basePrice: parseFloat(formBasePrice) || 0,
      comparePrice: formComparePrice ? parseFloat(formComparePrice) : null,
      shortDescription: formShortDescription,
      description: formDescription,
      isActive: formIsActive,
      isFeatured: formIsFeatured,
      images: formImages,
      variants: formVariants,
      materials: formMaterials,
    };

    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setShowFormModal(false);
      fetchData(); // Reload list
    } catch (err: any) {
      setFormError(err.message || 'Save failed. Check SKU/Slug uniqueness.');
    }
  };

  // 6. Delete Handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? All variants, images and materials will be deleted.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');

      fetchData(); // Reload list
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-900 font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Synchronizing Studio Catalog...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'} font-sans`}>
      
      {/* Admin Sidebar */}
      <aside className={`w-64 border-r shrink-0 flex flex-col justify-between ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <div className="p-6 space-y-8">
          <div className="font-serif text-2xl font-bold tracking-tight">
            Logidecore Admin
          </div>
          
          <nav className="space-y-1 text-xs font-bold uppercase tracking-widest">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full text-left py-3.5 px-4 rounded-sm flex items-center gap-3 transition-colors ${
                activeMenu === 'dashboard' ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Studio Analytics
            </button>
            <button
              onClick={() => setActiveMenu('products')}
              className={`w-full text-left py-3.5 px-4 rounded-sm flex items-center gap-3 transition-colors ${
                activeMenu === 'products' ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
              Manage Products
            </button>
            <button
              onClick={() => setActiveMenu('orders')}
              className={`w-full text-left py-3.5 px-4 rounded-sm flex items-center gap-3 transition-colors ${
                activeMenu === 'orders' ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Studio Orders
            </button>
            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full text-left py-3.5 px-4 rounded-sm flex items-center gap-3 transition-colors ${
                activeMenu === 'settings' ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Settings
            </button>
          </nav>
        </div>

        {/* Dark Mode toggle sidebar footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full py-3 border border-outline-variant/40 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
            {darkMode ? 'Light Theme' : 'Dark Mode'}
          </button>
          <a
            href="/api/auth/logout"
            onClick={async (e) => {
              e.preventDefault();
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/admin/login');
            }}
            className="w-full py-3 bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/20 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Logout
          </a>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-grow p-10 space-y-10 overflow-y-auto max-h-screen">
        
        {/* Header toolbar */}
        <header className="flex justify-between items-center border-b pb-6 dark:border-neutral-800">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary font-bold block mb-1">
              Logidecore Operations Control
            </span>
            <h1 className="font-serif text-3xl font-bold">
              {activeMenu === 'dashboard' && 'Studio Analytics & Operations'}
              {activeMenu === 'products' && 'Product Catalogue Management'}
              {activeMenu === 'orders' && 'Studio Custom Art Orders'}
              {activeMenu === 'settings' && 'Studio Settings Panel'}
            </h1>
          </div>
        </header>

        {loadError && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-800 rounded shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200 text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-serif text-base font-bold text-neutral-900">Database Connection Refused</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Prisma Client failed to reach the database server.
                  </p>
                </div>
                <div className="bg-white border border-neutral-200 rounded p-3 font-mono text-[10px] text-red-600 break-all leading-normal max-w-xl">
                  {loadError}
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-primary text-white text-[10px] tracking-wider uppercase font-bold hover:bg-primary/90 transition-all rounded shadow-sm"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. Dashboard View */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 rounded shadow-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Total Categories</span>
                <span className="text-2xl font-bold">{categories.length}</span>
                <span className="text-xs text-secondary block mt-2">Active design lines</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 rounded shadow-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Total Products</span>
                <span className="text-2xl font-bold">{Array.isArray(products) ? products.length : 0}</span>
                <span className="text-xs text-green-500 block mt-2">Available designs</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 rounded shadow-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Total Variants</span>
                <span className="text-2xl font-bold">
                  {Array.isArray(products) ? products.reduce((acc, p) => acc + (p.variants?.length || 0), 0) : 0}
                </span>
                <span className="text-xs text-green-500 block mt-2">Size/thickness matrices</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 rounded shadow-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Status</span>
                <span className="text-2xl font-bold text-secondary">Online</span>
                <span className="text-xs text-neutral-400 block mt-2">Neon DB Connected</span>
              </div>
            </div>

            {/* Simulated analytics block */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded">
              <h3 className="font-serif text-lg font-bold mb-6">Database Catalog Health</h3>
              <div className="text-xs space-y-2 text-neutral-400">
                <p>● Connected to Neon serverless host: <code className="text-primary font-mono">ep-curly-smoke-aufiaktb</code></p>
                <p>● Storage: Cloudinary cloud account <code className="text-primary font-mono">disdyswop</code></p>
                <p>● Seed status: Active</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Products Catalog CRUD View */}
        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 rounded">
              <div>
                <h3 className="font-serif text-xl font-bold mb-1">Active Catalogue</h3>
                <p className="text-xs text-neutral-400">
                  Manage frame products, custom materials lists, variants pricing matrices, and secure Cloudinary media links.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoriesModal(true)}
                  className="px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-primary text-neutral-600 dark:text-neutral-300 text-xs uppercase tracking-widest font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all rounded cursor-pointer"
                >
                  Manage Categories
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-5 py-3 bg-primary text-white text-xs uppercase tracking-widest font-bold hover:bg-primary/95 transition-all rounded cursor-pointer"
                >
                  + Add Custom Design
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 gap-6">
              {products.map((p) => {
                const thumbnail = p.images.find(img => img.isThumbnail)?.imageUrl || p.images[0]?.imageUrl || '';
                return (
                  <div key={p.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="flex flex-col md:flex-row gap-6">
                      {thumbnail && (
                        <div className="w-24 h-24 relative overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 rounded">
                          <img src={thumbnail} alt={p.name} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-secondary font-bold px-2 py-0.5 bg-secondary/15 rounded">
                          {p.category?.name}
                        </span>
                        <h4 className="font-serif text-lg font-bold">{p.name}</h4>
                        <p className="text-xs text-neutral-400 font-mono">SKU: {p.sku} | Slug: {p.slug}</p>
                        <p className="text-xs text-neutral-300 line-clamp-2 max-w-xl">{p.shortDescription}</p>
                        
                        {/* Summary Pill counts */}
                        <div className="flex gap-4 pt-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                          <span>{p.variants.length} Variants</span>
                          <span>•</span>
                          <span>{p.materials.length} Materials</span>
                          <span>•</span>
                          <span>{p.images.length} Media Assets</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0 justify-end">
                      <div className="text-right mb-0 md:mb-3">
                        <span className="text-[10px] uppercase text-neutral-400 block">Base Price</span>
                        <span className="text-lg font-serif font-bold text-primary dark:text-white">Rs. {p.basePrice.toString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 hover:border-primary text-xs uppercase font-bold tracking-widest transition-all rounded text-center flex-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-4 py-2 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/30 text-xs uppercase font-bold tracking-widest transition-all rounded text-center flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {products.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
                  <p className="text-sm text-neutral-400">No products found in the database. Seed the database to load sample data.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Orders View placeholder */}
        {activeMenu === 'orders' && (
          <div className="bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 rounded font-sans space-y-6">
            <h3 className="font-serif text-xl font-bold border-b pb-4 dark:border-neutral-800">Studio Custom Orders Tracking</h3>
            <p className="text-xs text-neutral-400">Custom customer art prints and order tracking module.</p>
            <div className="text-center py-20 text-neutral-500 text-xs">
              Database contains orders table. Add orders from checkout to view here.
            </div>
          </div>
        )}

        {/* 4. Settings View placeholder */}
        {activeMenu === 'settings' && (
          <div className="flex flex-col md:flex-row gap-6 items-start max-w-5xl">
            {/* System Info card */}
            <div className="bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 rounded font-sans space-y-6 flex-1 min-w-[280px]">
              <h3 className="font-serif text-xl font-bold border-b pb-4 dark:border-neutral-800">Studio Settings</h3>
              <p className="text-xs text-neutral-400">Configure global shop parameters.</p>
              <div className="space-y-4 text-xs">
                <p>● DB Name: <span className="font-mono text-primary">logidecore</span></p>
                <p>● Storage Engine: <span className="font-mono text-primary">Cloudinary disdyswop</span></p>
                <p>● Status: Active</p>
              </div>
            </div>

            {/* Category Management card */}
            <div className="bg-white dark:bg-neutral-900 p-8 border border-neutral-200 dark:border-neutral-800 rounded font-sans space-y-6 flex-1 min-w-[320px]">
              <h3 className="font-serif text-xl font-bold border-b pb-4 dark:border-neutral-800">Category Management</h3>
              
              {/* Form to add a new category */}
              <form onSubmit={handleCreateSettingsCategory} className="space-y-3">
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Add New Category</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={settingsCategoryName}
                    onChange={(e) => setSettingsCategoryName(e.target.value)}
                    placeholder="e.g. Birthday Frames"
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs outline-none focus:border-primary text-black dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={creatingSettingsCategory || !settingsCategoryName.trim()}
                    className="px-4 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded disabled:opacity-50 hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    {creatingSettingsCategory ? '...' : 'Add'}
                  </button>
                </div>
              </form>

              {/* Current Categories List */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Active Categories ({categories.length})</label>
                <div className="max-h-[160px] overflow-y-auto border border-neutral-100 dark:border-neutral-800 rounded p-3 bg-neutral-50/50 dark:bg-neutral-950/20 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {categories.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">No categories created yet.</p>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{cat.name}</span>
                        <span className="font-mono text-[9px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          slug: {cat.slug}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 7. Fullscreen Add/Edit Product Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-neutral-800 shrink-0">
              <h3 className="text-xl font-serif font-bold">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Create New Product Design'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <form onSubmit={handleSaveProduct} className="flex-grow overflow-y-auto p-8 space-y-8 text-xs">
              {formError && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded text-red-400 font-bold">
                  {formError}
                </div>
              )}

              {/* SECTION 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-neutral-800 pb-2">1. Basic Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Product Name</label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Acrylic Portrait Photo Print"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Product Slug</label>
                    <input
                      required
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="e.g. acrylic-portrait-photo-print"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">SKU Reference</label>
                    <input
                      required
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      placeholder="e.g. ACRY-PORT-01"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Design Category</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(!showNewCategoryInput);
                          setNewCategoryName('');
                        }}
                        className="text-[10px] font-sans font-bold text-primary uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        {showNewCategoryInput ? "✕ Cancel" : "＋ New Category"}
                      </button>
                    </div>
                    {showNewCategoryInput ? (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="New Category Name"
                          className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all text-white text-xs placeholder:text-neutral-600"
                          disabled={creatingCategory}
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory || !newCategoryName.trim()}
                          className="px-4 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded disabled:opacity-50 transition-all flex items-center justify-center min-w-[80px] cursor-pointer"
                        >
                          {creatingCategory ? "..." : "Create"}
                        </button>
                      </div>
                    ) : (
                      <select
                        required
                        value={formCategoryId}
                        onChange={(e) => setFormCategoryId(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all text-white"
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Base Price (INR)</label>
                    <input
                      required
                      type="number"
                      value={formBasePrice}
                      onChange={(e) => setFormBasePrice(e.target.value)}
                      placeholder="599"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Compare Price (INR)</label>
                    <input
                      type="number"
                      value={formComparePrice}
                      onChange={(e) => setFormComparePrice(e.target.value)}
                      placeholder="1199"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Short Description</label>
                  <input
                    type="text"
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    placeholder="Short summary displayed in lists"
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Full Detailed Description</label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide materials, printing type, backing details..."
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded outline-none focus:border-primary transition-all placeholder:text-neutral-600"
                  ></textarea>
                </div>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="font-bold">Active in Catalog</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="accent-primary"
                    />
                    <span className="font-bold">Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* SECTION 2: Image Uploads */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-neutral-800 pb-2">2. Image Gallery</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-center border-2 border-dashed border-neutral-800 rounded-lg p-6 bg-neutral-950/40 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="text-center space-y-2">
                      <span className="material-symbols-outlined text-[36px] text-neutral-500">cloud_upload</span>
                      <p className="text-neutral-400">
                        {uploadingImage ? 'Uploading image to Cloudinary...' : 'Click or Drag images here to upload directly to Cloudinary'}
                      </p>
                    </div>
                  </div>

                  {/* Previews */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="bg-neutral-950 border border-neutral-800 p-2.5 rounded relative group">
                        <div className="h-28 overflow-hidden bg-neutral-900 rounded mb-2 flex items-center justify-center">
                          <img src={img.imageUrl} alt="preview" className="object-cover h-full w-full" />
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="thumbnail"
                              checked={img.isThumbnail}
                              onChange={() => {
                                const updated = formImages.map((item, i) => ({
                                  ...item,
                                  isThumbnail: i === idx,
                                }));
                                setFormImages(updated);
                              }}
                              className="accent-primary"
                            />
                            <span className="text-[10px] text-neutral-400">Thumbnail</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="text-red-500 hover:text-red-400 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Product Variants */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-neutral-800 pb-2">3. Product Pricing Matrix (Variants)</h4>
                
                {/* Current Variants list */}
                {formVariants.length > 0 && (
                  <div className="overflow-x-auto border border-neutral-800 rounded bg-neutral-950/40">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-950 font-bold uppercase text-[9px] tracking-wider text-neutral-400">
                          <th className="p-3">Size</th>
                          <th className="p-3">Thickness</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Compare Price</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formVariants.map((v, idx) => (
                          <tr key={idx} className="border-b border-neutral-800">
                            <td className="p-3 font-semibold">{v.size}</td>
                            <td className="p-3">{v.thickness}</td>
                            <td className="p-3 font-mono">Rs. {v.price}</td>
                            <td className="p-3 font-mono text-neutral-500">Rs. {v.comparePrice || '-'}</td>
                            <td className="p-3 font-mono">{v.sku}</td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => removeVariant(idx)}
                                className="text-red-500 hover:text-red-400 font-bold uppercase text-[10px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Variant Form */}
                <div className="bg-neutral-950/80 p-5 border border-neutral-800 rounded grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 8x12"
                      value={tempVariantSize}
                      onChange={(e) => setTempVariantSize(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Thickness</label>
                    <input
                      type="text"
                      placeholder="e.g. 3mm"
                      value={tempVariantThickness}
                      onChange={(e) => setTempVariantThickness(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Price (INR)</label>
                    <input
                      type="number"
                      placeholder="599"
                      value={tempVariantPrice}
                      onChange={(e) => setTempVariantPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Compare Price</label>
                    <input
                      type="number"
                      placeholder="1199"
                      value={tempVariantComparePrice}
                      onChange={(e) => setTempVariantComparePrice(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Variant SKU</label>
                    <input
                      type="text"
                      placeholder="SKU-812-3"
                      value={tempVariantSku}
                      onChange={(e) => setTempVariantSku(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="w-full py-2 bg-secondary text-white font-bold uppercase tracking-widest hover:bg-secondary/95 transition-all rounded text-[10px]"
                  >
                    + Variant
                  </button>
                </div>
              </div>

              {/* SECTION 4: Product Materials */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-neutral-800 pb-2">4. Design Material & Finishing Details</h4>
                
                {/* List */}
                {formMaterials.length > 0 && (
                  <div className="space-y-3">
                    {formMaterials.map((m, idx) => (
                      <div key={idx} className="bg-neutral-950 p-4 border border-neutral-800 rounded flex justify-between items-center">
                        <div>
                          <p className="font-bold">{m.title}</p>
                          <p className="text-neutral-400 text-[11px] mt-0.5">{m.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMaterial(idx)}
                          className="text-red-500 hover:text-red-400 font-bold uppercase text-[10px] shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Form */}
                <div className="bg-neutral-950/80 p-5 border border-neutral-800 rounded flex flex-col sm:flex-row gap-4 items-end">
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Material Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Museum Grade Acrylic Substrate"
                      value={tempMaterialTitle}
                      onChange={(e) => setTempMaterialTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1 w-full font-sans">
                    <label className="text-[10px] text-neutral-400 uppercase font-bold">Material Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium 3mm thick clear cast acrylic sheet with smooth laser polished edges."
                      value={tempMaterialDescription}
                      onChange={(e) => setTempMaterialDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded outline-none focus:border-primary placeholder:text-neutral-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="py-2.5 px-6 bg-secondary text-white font-bold uppercase tracking-widest hover:bg-secondary/95 transition-all rounded text-[10px] shrink-0 w-full sm:w-auto"
                  >
                    + Material
                  </button>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 px-8 py-5 border-t border-neutral-800 bg-neutral-950 shrink-0">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="px-6 py-3 border border-neutral-800 hover:border-neutral-700 text-xs font-bold uppercase tracking-widest rounded transition-all text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/95 rounded transition-all"
              >
                {editingProduct ? 'Save Product Changes' : 'Publish Product Design'}
              </button>
            </div>

          </div>
        </div>
      )}

      {showCategoriesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-lg max-w-lg w-full flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 font-sans">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 shrink-0">
              <h3 className="text-lg font-serif font-bold">Category Management</h3>
              <button
                onClick={() => {
                  setShowCategoriesModal(false);
                  setSettingsCategoryName('');
                }}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Add New Category Form */}
              <form onSubmit={handleCreateSettingsCategory} className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Add New Category</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={settingsCategoryName}
                    onChange={(e) => setSettingsCategoryName(e.target.value)}
                    placeholder="e.g. Birthday Frames"
                    className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded text-xs outline-none focus:border-primary text-white"
                    disabled={creatingSettingsCategory}
                  />
                  <button
                    type="submit"
                    disabled={creatingSettingsCategory || !settingsCategoryName.trim()}
                    className="px-5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded disabled:opacity-50 hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    {creatingSettingsCategory ? '...' : 'Add'}
                  </button>
                </div>
              </form>

              {/* List of Categories */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Active Categories ({categories.length})</label>
                <div className="max-h-[300px] overflow-y-auto border border-neutral-800 rounded p-4 bg-neutral-950/40 divide-y divide-neutral-800">
                  {categories.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic">No categories created yet.</p>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white">{cat.name}</p>
                          <p className="font-mono text-[9px] text-neutral-500">slug: {cat.slug}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded cursor-pointer"
                          title="Delete Category"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
