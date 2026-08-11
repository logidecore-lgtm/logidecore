'use client';

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
  selectedSize?: string;
  onZoomChange?: (zoom: number) => void;
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
  selectedSize = '',
  onZoomChange,
}: FramePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Touch tracking states for pinch-to-zoom
  const activePointers = useRef<{ [pointerId: number]: { x: number; y: number } }>({});
  const initialDistance = useRef<number | null>(null);
  const initialZoomVal = useRef<number>(1);

  // Reset drag state if interactivity is turned off
  useEffect(() => {
    if (!isInteractive) {
      setIsDragging(false);
    }
  }, [isInteractive]);

  // Handle pointer down (mouse click or touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    // Add pointer to active list
    activePointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    // If two fingers are touching, initialize pinch-to-zoom
    const pointerKeys = Object.keys(activePointers.current);
    if (pointerKeys.length === 2) {
      const p1 = activePointers.current[Number(pointerKeys[0])];
      const p2 = activePointers.current[Number(pointerKeys[1])];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      initialDistance.current = dist;
      initialZoomVal.current = zoom;
      setIsDragging(false); // Stop dragging when pinching starts
    } else {
      // Otherwise, handle regular single-finger drag start
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    // Update active pointer position
    if (activePointers.current[e.pointerId]) {
      activePointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    }

    const pointerKeys = Object.keys(activePointers.current);
    if (pointerKeys.length === 2 && initialDistance.current !== null && onZoomChange) {
      // Pinch gesture active
      const p1 = activePointers.current[Number(pointerKeys[0])];
      const p2 = activePointers.current[Number(pointerKeys[1])];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      
      // Calculate new zoom factor
      const ratio = dist / initialDistance.current;
      // Clamp zoom between 1.0 and 3.0
      const newZoom = Math.min(Math.max(initialZoomVal.current * ratio, 1.0), 3.0);
      onZoomChange(newZoom);
    } else if (isDragging) {
      // Drag gesture active (only if 1 finger)
      e.preventDefault();
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      onTransformChange?.({
        translateX: translateX + dx,
        translateY: translateY + dy,
      });
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return;

    // Remove pointer from active list
    delete activePointers.current[e.pointerId];

    // Reset pinch distance tracking
    initialDistance.current = null;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  // Get frame styling based on selection - all borders removed for full-size print display
  const getFrameStyle = () => {
    return {
      boxShadow: 'none',
      border: 'none',
    };
  };

  // Remove mat board padding completely so images occupy 100% full size
  const getMatPadding = () => {
    return 'p-0';
  };

  // Dynamically resolve aspect ratio based on selectedSize string (e.g. 8x12, 12x12)
  const getAspectRatioStyle = () => {
    if (!selectedSize) return { aspectRatio: '3/4' };
    
    const clean = selectedSize.toLowerCase().replace(/"/g, '').replace(/\s+/g, '');
    
    // Check for square sizes
    if (clean.includes('8x8') || clean.includes('12x12') || clean.includes('8*8') || clean.includes('12*12') || clean.includes('10x10')) {
      return { aspectRatio: '1/1' };
    }
    
    // Parse dimensions from strings like "8x12", "12*18"
    const match = clean.match(/(\d+)(?:x|\*|by|&)(\d+)/);
    if (match) {
      const w = parseInt(match[1], 10);
      const h = parseInt(match[2], 10);
      if (w > 0 && h > 0) {
        return { aspectRatio: `${w}/${h}` };
      }
    }
    
    return { aspectRatio: '3/4' };
  };

  // Combine translation, scaling (zoom), rotation, and flips into a single CSS transform string
  const transformStyle = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${
      flipX ? -1 : 1
    }) scaleY(${flipY ? -1 : 1})`,
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  // Dynamic template layout (vocal size updates to fill parent height/width)
  if (frameStyle === 'template' && templateUrl) {
    return (
      <div 
        className="flex flex-col items-center justify-center w-full h-full max-h-full p-0"
        style={{ userSelect: 'none' }}
      >
        <div
          ref={containerRef}
          className="w-full h-full max-h-full flex flex-col bg-white relative overflow-hidden transition-all duration-300 shadow-xl rounded-lg border border-neutral-200"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: isInteractive ? 'grab' : 'default', ...getAspectRatioStyle() }}
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
          {selectedSize && (
            <div className="absolute bottom-4 left-4 bg-black/65 text-white font-sans text-[10px] font-bold px-3 py-1.5 uppercase rounded-full tracking-widest z-20 pointer-events-none select-none">
              Size: {selectedSize.toLowerCase().replace('x', ' * ')} Inch
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full aspect-square select-none"
      style={{ userSelect: 'none' }}
    >
      {/* PHOTO WINDOW
          This matches the transparent opening inside ary-frame.png
      */}
      <div
        ref={containerRef}
        className={`absolute overflow-hidden ${
          isInteractive ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          left: '26.5%',
          top: '11%',
          width: '47.4%',
          height: '74.2%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Customized Preview"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            style={{
              ...transformStyle,
              transformOrigin: 'center center',
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-neutral-900/80 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded shadow-md pointer-events-none">
              Tap to upload
            </span>
          </div>
        )}

        {/* Glass effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
      </div>

      {/* FRAME — ALWAYS ON TOP */}
      <img
        src="/ary-frame.png"
        alt="Frame"
        draggable={false}
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-10"
      />

      {/* Size */}
      {selectedSize && (
        <div className="absolute bottom-4 left-4 bg-black/65 text-white font-sans text-[10px] font-bold px-3 py-1.5 uppercase rounded-full tracking-widest z-20 pointer-events-none select-none">
          Size: {selectedSize.toLowerCase().replace('x', ' * ')} Inch
        </div>
      )}

      {/* Custom text */}
      {matSize !== 'none' && customText && (
        <div className="absolute bottom-2 md:bottom-4 left-4 right-4 text-center select-none pointer-events-none z-20">
          <span className="font-serif italic text-[11px] md:text-xs tracking-[0.18em] uppercase text-neutral-600 block truncate font-medium">
            "{customText}"
          </span>
        </div>
      )}
    </div>
  );
}
