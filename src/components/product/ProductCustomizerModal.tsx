'use client';

import React, { useState, useEffect, useRef } from 'react';
import FramePreview from './FramePreview';
import { compressImage } from '@/lib/image-utils';

interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  templateUrl?: string;
  initialCustomText?: string;
  initialFrameStyle?: 'gold' | 'black' | 'oak' | 'silver' | 'template';
  initialMatSize?: 'none' | 'thin' | 'wide';
  initialZoom?: number;
  initialRotation?: number;
  initialFlipX?: boolean;
  initialFlipY?: boolean;
  initialTranslateX?: number;
  initialTranslateY?: number;
  onSave: (customizationData: {
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
  }) => void;
  isTemplateProduct?: boolean;
  selectedSize?: string;
}

export default function ProductCustomizerModal({
  isOpen,
  onClose,
  imageUrl: initialImageUrl,
  templateUrl = '',
  initialCustomText = '',
  initialFrameStyle = 'gold',
  initialMatSize = 'wide',
  initialZoom = 1,
  initialRotation = 0,
  initialFlipX = false,
  initialFlipY = false,
  initialTranslateX = 0,
  initialTranslateY = 0,
  onSave,
  isTemplateProduct = false,
  selectedSize = '',
}: ProductCustomizerModalProps) {
  // Modal states
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(initialRotation);
  const [flipX, setFlipX] = useState(initialFlipX);
  const [flipY, setFlipY] = useState(initialFlipY);
  const [translateX, setTranslateX] = useState(initialTranslateX);
  const [translateY, setTranslateY] = useState(initialTranslateY);
  const [frameStyle, setFrameStyle] = useState<'gold' | 'black' | 'oak' | 'silver' | 'template'>(initialFrameStyle);
  const [matSize, setMatSize] = useState<'none' | 'thin' | 'wide'>(initialMatSize);
  const [customText, setCustomText] = useState(initialCustomText);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageUrl(initialImageUrl);
      setZoom(initialZoom);
      setRotation(initialRotation);
      setFlipX(initialFlipX);
      setFlipY(initialFlipY);
      setTranslateX(initialTranslateX);
      setTranslateY(initialTranslateY);
      setFrameStyle(initialFrameStyle);
      setMatSize(initialMatSize);
      setCustomText(initialCustomText);
    }
  }, [
    isOpen,
    initialImageUrl,
    initialZoom,
    initialRotation,
    initialFlipX,
    initialFlipY,
    initialTranslateX,
    initialTranslateY,
    initialFrameStyle,
    initialMatSize,
    initialCustomText,
  ]);

  if (!isOpen) return null;

  // Handle local image upload inside the customizer
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setImageUrl(data.url);
      // Reset transformations for the new image
      setZoom(1);
      setRotation(0);
      setFlipX(false);
      setFlipY(false);
      setTranslateX(0);
      setTranslateY(0);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setTranslateX(0);
    setTranslateY(0);
  };

  const handleSave = () => {
    onSave({
      imageUrl,
      zoom,
      rotation,
      flipX,
      flipY,
      translateX,
      translateY,
      frameStyle,
      matSize,
      customText,
    });
    onClose();
  };

  const handleCanvasClick = () => {
    if (!imageUrl && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="bg-white dark:bg-neutral-900 text-primary w-full max-w-5xl h-[94vh] lg:h-[600px] flex flex-col lg:flex-row overflow-hidden shadow-2xl rounded-2xl animate-in zoom-in-95 duration-300 border border-neutral-100 dark:border-neutral-800">

        {/* Hidden File Input for Triggering Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Left Side: Canvas Frame Preview */}
        <div
          onClick={handleCanvasClick}
          className="flex-grow flex-[1.2] bg-[#eaeaea] dark:bg-neutral-950 flex flex-col items-center justify-center relative p-3 md:p-6 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 h-[45%] lg:h-auto cursor-pointer"
        >
          {/* Top Control Overlay on Canvas */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
            {/* Reset Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="bg-white/95 dark:bg-neutral-900/95 hover:bg-white text-neutral-700 dark:text-neutral-200 text-xs font-semibold px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-md flex items-center gap-1.5 transition-all pointer-events-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Design
            </button>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="bg-white/95 dark:bg-neutral-900/95 hover:bg-white text-neutral-500 hover:text-neutral-700 p-2 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {uploading ? (
            <div className="space-y-4 text-center z-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="text-xs text-primary font-bold uppercase tracking-widest animate-pulse">
                Uploading Photo...
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <FramePreview
                imageUrl={imageUrl}
                zoom={zoom}
                rotation={rotation}
                flipX={flipX}
                flipY={flipY}
                translateX={translateX}
                translateY={translateY}
                frameStyle={frameStyle}
                matSize={matSize}
                customText={customText}
                templateUrl={templateUrl}
                isInteractive={!!imageUrl}
                selectedSize={selectedSize}
                onZoomChange={(z) => setZoom(z)}
                onTransformChange={({ translateX: tx, translateY: ty }) => {
                  setTranslateX(tx);
                  setTranslateY(ty);
                }}
              />
            </div>
          )}

          {imageUrl && !uploading && (
            <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none select-none">
              <span className="bg-black/60 text-[10px] md:text-xs text-white/80 font-sans tracking-wider px-3 py-1.5 rounded-full uppercase">
                💡 Click & Drag photo inside frame to reposition
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Options & Control Panel */}
        <div className="w-full lg:w-[380px] bg-white dark:bg-neutral-900 p-4 md:p-6 pb-2 md:pb-6 flex flex-col justify-between h-[55%] lg:h-full overflow-y-auto lg:overflow-y-visible font-sans border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-neutral-800">
          <div className="space-y-3.5 md:space-y-6">

            {/* 1. Quick Transform Tools */}
            <div className="space-y-3">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                Transform Tools
              </span>
              <div className="grid grid-cols-5 gap-2">
                <button
                  onClick={handleRotateLeft}
                  disabled={!imageUrl}
                  className="flex items-center justify-center p-2.5 md:p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer"
                  title="Rotate Left"
                >
                  <span className="material-symbols-outlined text-[20px]">undo</span>
                </button>
                <button
                  onClick={handleRotateRight}
                  disabled={!imageUrl}
                  className="flex items-center justify-center p-2.5 md:p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer"
                  title="Rotate Right"
                >
                  <span className="material-symbols-outlined text-[20px]">redo</span>
                </button>
                <button
                  onClick={() => setFlipX((p) => !p)}
                  disabled={!imageUrl}
                  className={`flex items-center justify-center p-2.5 md:p-3 border rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer ${flipX ? 'border-primary bg-primary/5 text-primary' : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  title="Flip Horizontal"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                </button>
                <button
                  onClick={() => setFlipY((p) => !p)}
                  disabled={!imageUrl}
                  className={`flex items-center justify-center p-2.5 md:p-3 border rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer ${flipY ? 'border-primary bg-primary/5 text-primary' : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  title="Flip Vertical"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_vert</span>
                </button>
                <button
                  onClick={() => setImageUrl('')}
                  disabled={!imageUrl}
                  className="flex items-center justify-center p-2.5 md:p-3 border border-red-100 dark:border-red-950 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-40 transition-all cursor-pointer"
                  title="Delete Photo"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>

            {imageUrl && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  <span>Photo Zoom / Scale</span>
                  <span className="font-mono text-primary font-bold">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-neutral-250 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                />
              </div>
            )}

            {/* Selected Frame Size display */}
            {selectedSize && (
              <div className="space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-200">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Selected Frame Size
                </span>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-[11px] font-bold text-neutral-700 dark:text-neutral-350 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-amber-500">aspect_ratio</span>
                  <span className="uppercase">{selectedSize.toLowerCase().replace('x', ' * ')} Inch</span>
                </div>
              </div>
            )}

            {/* 2. Text / Custom Name Input - conditional on template cards */}
            {isTemplateProduct && (
              <div className="space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                  Name/ Text
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Name/ Text"
                  className="w-full px-3.5 py-2 md:px-4 md:py-3 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs md:text-sm placeholder:text-neutral-450 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans bg-transparent"
                />
                <div className="text-[9px] text-neutral-400 text-right font-mono">
                  {customText.length}/20
                </div>
              </div>
            )}

            {/* Change Photo Trigger Button if photo already exists */}
            {imageUrl && (
              <div className="pt-1.5 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <button className="w-full py-2 border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-450 rounded-lg text-neutral-500 hover:text-neutral-700 font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 bg-neutral-50/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all pointer-events-none">
                  <span className="material-symbols-outlined text-[16px]">photo_library</span>
                  Choose different photo
                </button>
              </div>
            )}

          </div>

          {/* 3. Footer / Save button */}
          <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-lg shadow-primary/10 transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              Save Design
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
