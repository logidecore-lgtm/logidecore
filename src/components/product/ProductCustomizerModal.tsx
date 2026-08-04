import React, { useState, useEffect } from 'react';
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
}

type TabType = 'frame' | 'adjust' | 'text';

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

  const [activeTab, setActiveTab] = useState<TabType>('frame');
  const [uploading, setUploading] = useState(false);

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

  // If no image is uploaded yet, show a beautiful, centered upload dropzone first
  if (!imageUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
        <div className="bg-white text-primary w-full max-w-2xl overflow-hidden shadow-2xl rounded-lg animate-in zoom-in-95 duration-200 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-neutral-800">
                Upload Custom Photo
              </h2>
              <p className="text-[10px] text-neutral-400 font-sans font-bold uppercase tracking-wider mt-0.5">
                Bespoke Mounting Studio
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Uploader Box */}
          <div className="p-8 md:p-12 flex flex-col items-center justify-center">
            <div className="border-2 border-dashed border-neutral-200 hover:border-primary transition-colors p-10 md:p-16 w-full rounded-md text-center bg-neutral-50/50 relative cursor-pointer flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              />
              {uploading ? (
                <div className="space-y-4 text-center z-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest animate-pulse">
                    Uploading High-Resolution File...
                  </p>
                  <p className="text-[10px] text-neutral-400">Processing and compressing image for mounting preview...</p>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col items-center justify-center z-20">
                  <span className="material-symbols-outlined text-[48px] text-neutral-400 mb-2 animate-bounce">
                    cloud_upload
                  </span>
                  <div>
                    <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-800 mb-1">
                      Drop high-res photo or click to browse
                    </h3>
                    <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      We support JPG and PNG image files up to 20MB. Your photo will load directly inside the customized premium frame.
                    </p>
                  </div>
                  <span className="px-6 py-2.5 bg-primary text-white text-[10px] font-sans font-bold uppercase tracking-widest shadow-sm rounded-sm hover:bg-primary/95 transition-all">
                    Browse Files
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-primary w-full max-w-4xl h-[90vh] md:h-[650px] flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-lg animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Dynamic Canvas Frame Preview */}
        <div className="flex-1 bg-neutral-900 flex flex-col items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-neutral-800 h-[45%] md:h-auto">
          {/* Back light glow / ambiance */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
          
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
            isInteractive={true}
            onTransformChange={({ translateX: tx, translateY: ty }) => {
              setTranslateX(tx);
              setTranslateY(ty);
            }}
          />

          <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none select-none">
            <span className="bg-black/60 text-[10px] md:text-xs text-white/80 font-sans tracking-wider px-3 py-1.5 rounded-full uppercase">
              💡 Click & Drag photo inside frame to reposition
            </span>
          </div>
        </div>

        {/* Right Side: Options & Control Panel */}
        <div className="w-full md:w-[380px] bg-white flex flex-col h-[55%] md:h-full justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-neutral-800">
                Customization Studio
              </h2>
              <p className="text-[10px] text-neutral-400 font-sans font-bold uppercase tracking-wider mt-0.5">
                Bespoke Decorative Mounts
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-neutral-100 text-xs font-sans font-bold uppercase tracking-widest bg-neutral-50/20">
            <button
              onClick={() => setActiveTab('frame')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'frame'
                  ? 'border-primary text-primary bg-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Frame & Mat
            </button>
            <button
              onClick={() => setActiveTab('adjust')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'adjust'
                  ? 'border-primary text-primary bg-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Adjust Photo
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${
                activeTab === 'text'
                  ? 'border-primary text-primary bg-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Quote / Text
            </button>
          </div>

          {/* Scrollable Tab Content Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* TAB 1: FRAME & MAT SELECTIONS */}
            {activeTab === 'frame' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Frame Material */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-500">
                    Select Frame Border
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFrameStyle('gold')}
                      className={`flex items-center space-x-3 p-3 border rounded transition-all text-left ${
                        frameStyle === 'gold'
                          ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#997300] to-[#fff3b3] border border-black/10" />
                      <span className="text-xs font-bold font-sans">Classic Gold</span>
                    </button>

                    <button
                      onClick={() => setFrameStyle('black')}
                      className={`flex items-center space-x-3 p-3 border rounded transition-all text-left ${
                        frameStyle === 'black'
                          ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-neutral-900 border border-black/10" />
                      <span className="text-xs font-bold font-sans">Modern Black</span>
                    </button>

                    <button
                      onClick={() => setFrameStyle('oak')}
                      className={`flex items-center space-x-3 p-3 border rounded transition-all text-left ${
                        frameStyle === 'oak'
                          ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#a87e56] border border-black/10" />
                      <span className="text-xs font-bold font-sans">Natural Oak</span>
                    </button>

                    <button
                      onClick={() => setFrameStyle('silver')}
                      className={`flex items-center space-x-3 p-3 border rounded transition-all text-left ${
                        frameStyle === 'silver'
                          ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#888] to-[#e0e0e0] border border-black/10" />
                      <span className="text-xs font-bold font-sans">Classic Silver</span>
                    </button>

                    {templateUrl && (
                      <button
                        onClick={() => setFrameStyle('template')}
                        className={`col-span-2 flex items-center space-x-3 p-3 border rounded transition-all text-left ${
                          frameStyle === 'template'
                            ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[15px] text-neutral-600">wallpaper</span>
                        </div>
                        <span className="text-xs font-bold font-sans">Design Template (Artwork Overlay)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Mat Border Size */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-500">
                    Mat Board Border Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setMatSize('none')}
                      className={`py-3 text-center text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                        matSize === 'none'
                          ? 'bg-primary text-white border-primary'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                      }`}
                    >
                      None
                    </button>
                    <button
                      onClick={() => setMatSize('thin')}
                      className={`py-3 text-center text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                        matSize === 'thin'
                          ? 'bg-primary text-white border-primary'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                      }`}
                    >
                      Thin
                    </button>
                    <button
                      onClick={() => setMatSize('wide')}
                      className={`py-3 text-center text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                        matSize === 'wide'
                          ? 'bg-primary text-white border-primary'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                      }`}
                    >
                      Wide
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400 italic">
                    * The Mat board adds a museum-style white margin focus around your print.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ADJUST PHOTO (ROTATE, SCALE, FLIP) */}
            {activeTab === 'adjust' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Position adjust controls */}
                <div className="space-y-4">
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-500">
                    Quick Transform Tools
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRotateLeft}
                      className="flex-1 flex flex-col items-center justify-center p-3 border border-neutral-200 hover:border-neutral-400 rounded text-neutral-700 hover:bg-neutral-50 transition-all gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">rotate_left</span>
                      <span className="text-[9px] font-bold font-sans uppercase tracking-wider">Rotate Left</span>
                    </button>
                    <button
                      onClick={handleRotateRight}
                      className="flex-1 flex flex-col items-center justify-center p-3 border border-neutral-200 hover:border-neutral-400 rounded text-neutral-700 hover:bg-neutral-50 transition-all gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">rotate_right</span>
                      <span className="text-[9px] font-bold font-sans uppercase tracking-wider">Rotate Right</span>
                    </button>
                    <button
                      onClick={() => setFlipX((p) => !p)}
                      className={`flex-1 flex flex-col items-center justify-center p-3 border rounded text-neutral-700 hover:bg-neutral-50 transition-all gap-1 ${
                        flipX ? 'border-primary bg-primary/5 text-primary' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">flip</span>
                      <span className="text-[9px] font-bold font-sans uppercase tracking-wider">Flip H</span>
                    </button>
                    <button
                      onClick={() => setFlipY((p) => !p)}
                      className={`flex-1 flex flex-col items-center justify-center p-3 border rounded text-neutral-700 hover:bg-neutral-50 transition-all gap-1 ${
                        flipY ? 'border-primary bg-primary/5 text-primary' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] rotate-90">flip</span>
                      <span className="text-[9px] font-bold font-sans uppercase tracking-wider">Flip V</span>
                    </button>
                  </div>
                </div>

                {/* Scale/Zoom Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-500">
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
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-400 font-sans tracking-wide">
                    <span>1.0x (Standard)</span>
                    <span>3.0x (Maximum)</span>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 border border-dashed border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 font-sans text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset Transformations
                </button>
              </div>
            )}

            {/* TAB 3: CUSTOM TEXT / PRINT */}
            {activeTab === 'text' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-500">
                    Add Printed Quote or Custom Name
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="E.g., Happy Birthday Family, Paris 2026..."
                    className="w-full p-3 border border-neutral-300 rounded text-sm placeholder:text-neutral-300 focus:border-primary outline-none transition-all font-sans"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-400 font-sans tracking-wide font-semibold">
                    <span>Centered at the bottom of the mat board</span>
                    <span>{customText.length}/40 characters</span>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 border border-neutral-100 rounded text-[11px] text-neutral-500 font-sans leading-relaxed">
                  📢 <strong>Note:</strong> Custom text is printed in an elegant, uppercase serif typeface directly beneath the artwork window on the mat board. Leaving it blank removes it.
                </div>
              </div>
            )}

            {/* Change Image Button inside customization */}
            <div className="border-t border-neutral-100 pt-6">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-500 mb-3">
                Change High-Res Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <button className="w-full py-3 border border-neutral-200 hover:border-neutral-400 rounded text-neutral-600 font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 bg-neutral-50/50 hover:bg-neutral-50 transition-all">
                  <span className="material-symbols-outlined text-[18px]">photo_library</span>
                  {uploading ? 'Uploading...' : 'Choose different photo'}
                </button>
              </div>
            </div>

          </div>

          {/* Footer Save & Cancel Buttons */}
          <div className="p-5 border-t border-neutral-100 flex gap-3 bg-neutral-50/40">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded text-neutral-600 font-sans text-xs uppercase tracking-widest font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3.5 bg-primary hover:bg-primary/95 text-white rounded font-sans text-xs uppercase tracking-widest font-bold shadow-md hover:shadow transition-all"
            >
              Save Design
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
