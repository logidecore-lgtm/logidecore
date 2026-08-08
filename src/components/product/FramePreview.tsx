import React, { useRef, useState, useEffect } from 'react';

interface FramePreviewProps {
  imageUrl: string;
  zoom: number;
  rotation: number; // in degrees (e.g., 0, 90, 180, 270)
  flipX: boolean;
  flipY: boolean;
  translateX: number;
  translateY: number;
  frameStyle: 'gold' | 'black' | 'oak' | 'silver' | 'template';
  matSize: 'none' | 'thin' | 'wide';
  customText?: string;
  templateUrl?: string;
  isInteractive?: boolean;
  onTransformChange?: (transforms: { translateX: number; translateY: number }) => void;
}

export default function FramePreview({
  imageUrl,
  zoom,
  rotation,
  flipX,
  flipY,
  translateX,
  translateY,
  frameStyle,
  matSize,
  customText = '',
  templateUrl = '',
  isInteractive = false,
  onTransformChange,
}: FramePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset drag state if interactivity is turned off
  useEffect(() => {
    if (!isInteractive) {
      setIsDragging(false);
    }
  }, [isInteractive]);

  // Handle pointer down (mouse click or touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - translateX,
      y: e.clientY - translateY,
    });
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isInteractive) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    if (onTransformChange) {
      onTransformChange({
        translateX: newX,
        translateY: newY,
      });
    }
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  // Get frame styling based on selection
  const getFrameStyle = () => {
    switch (frameStyle) {
      case 'gold':
        return {
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.3)',
          border: '18px solid transparent',
          borderImage: 'linear-gradient(135deg, #a67c00 0%, #fff3b3 20%, #bf953f 40%, #fff8d6 60%, #b38728 80%, #7d5c00 100%) 18',
        };
      case 'black':
        return {
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.1)',
          border: '20px solid #151515',
          outline: '1px solid #2a2a2a',
        };
      case 'oak':
        return {
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
          border: '20px solid transparent',
          borderImage: 'linear-gradient(135deg, #a47d59 0%, #bfa080 30%, #87603c 60%, #a47d59 100%) 20',
          backgroundColor: '#a47d59',
        };
      case 'silver':
        return {
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
          border: '18px solid transparent',
          borderImage: 'linear-gradient(135deg, #6c6c6c 0%, #f0f0f0 20%, #9e9e9e 55%, #ffffff 80%, #525252 100%) 18',
        };
      case 'template':
      default:
        return {};
    }
  };

  // Get mat board padding/margins based on selection
  const getMatPadding = () => {
    switch (matSize) {
      case 'wide':
        return 'p-10 pb-14 md:p-12 md:pb-20';
      case 'thin':
        return 'p-5 pb-8 md:p-6 md:pb-12';
      case 'none':
      default:
        return 'p-0';
    }
  };

  // Combine translation, scaling (zoom), rotation, and flips into a single CSS transform string
  const transformStyle = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${
      flipX ? -1 : 1
    }) scaleY(${flipY ? -1 : 1})`,
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  // Dynamic template layout
  if (frameStyle === 'template' && templateUrl) {
    return (
      <div 
        className="flex flex-col items-center justify-center w-full h-full p-4"
        style={{ userSelect: 'none' }}
      >
        <div
          ref={containerRef}
          className="w-full max-w-[340px] aspect-[2/3] flex flex-col bg-white relative overflow-hidden transition-all duration-300 shadow-xl rounded-sm border border-neutral-200"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: isInteractive ? 'grab' : 'default' }}
        >
          {/* User's Photo Layer (Placed underneath template) */}
          <div className="absolute inset-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900 pointer-events-none select-none">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Customized Preview"
                className="absolute w-full h-full object-cover"
                style={transformStyle}
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                <span className="bg-neutral-900/80 text-white font-sans text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded shadow-md pointer-events-none">
                  Tap to upload
                </span>
              </div>
            )}
          </div>

          {/* Template Overlay (Placed on top of photo) */}
          <img
            src={templateUrl}
            alt="Template Overlay"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
            draggable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full p-4"
      style={{ userSelect: 'none' }}
    >
      {/* Outer Frame Wrapper */}
      <div
        ref={containerRef}
        className="w-full max-w-[420px] aspect-[3/4] flex flex-col bg-[#fafaf6] relative overflow-hidden transition-all duration-300"
        style={getFrameStyle() as React.CSSProperties}
      >
        {/* Mat Board Container */}
        <div className={`w-full h-full flex flex-col items-center justify-center relative ${getMatPadding()} bg-[#fafaf7] transition-all duration-300`}>
          
          {/* Inner Image Mask/Container */}
          <div 
            className={`w-full h-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${
              isInteractive ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
            style={{ 
              boxShadow: matSize !== 'none' ? 'inset 0 0 6px rgba(0, 0, 0, 0.2)' : 'none',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* The Actual Image */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Customized Preview"
                className="absolute w-full h-full object-contain pointer-events-none select-none"
                style={transformStyle}
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                <span className="bg-neutral-900/80 text-white font-sans text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded shadow-md pointer-events-none">
                  Tap to upload
                </span>
              </div>
            )}

            {/* Subtle inner reflection or glass shadow effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
          </div>

          {/* Custom Text Print on Mat Board */}
          {matSize !== 'none' && customText && (
            <div className="absolute bottom-2 md:bottom-4 left-4 right-4 text-center select-none pointer-events-none">
              <span className="font-serif italic text-[11px] md:text-xs tracking-[0.18em] uppercase text-neutral-600 block truncate font-medium">
                "{customText}"
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
