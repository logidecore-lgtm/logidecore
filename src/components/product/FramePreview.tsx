'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PhotoArea, DEFAULT_PHOTO_AREA } from '@/config/frame-config';

interface FramePreviewProps {
  imageUrl: string;
  frameImageUrl: string;
  photoArea?: PhotoArea;
  aspectRatio?: string;
  zoom: number;
  rotation: number; // in degrees (e.g., 0, 90, 180, 270)
  flipX: boolean;
  flipY: boolean;
  translateX: number;
  translateY: number;
  isInteractive?: boolean;
  onTransformChange?: (transforms: { translateX: number; translateY: number }) => void;
  selectedSize?: string;
  onZoomChange?: (zoom: number) => void;
  customText?: string;
  matSize?: string;
  onUploadClick?: () => void;
}

export default function FramePreview({
  imageUrl,
  frameImageUrl,
  photoArea = DEFAULT_PHOTO_AREA,
  aspectRatio = '1/1',
  zoom,
  rotation,
  flipX,
  flipY,
  translateX,
  translateY,
  isInteractive = false,
  onTransformChange,
  selectedSize = '',
  onZoomChange,
  customText = '',
  matSize = 'none',
  onUploadClick,
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

  // Combine translation, scaling (zoom), rotation, and flips into a single CSS transform string
  const transformStyle = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${
      flipX ? -1 : 1
    }) scaleY(${flipY ? -1 : 1})`,
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  return (
    <div 
      className="relative w-full h-full select-none"
      style={{ 
        userSelect: 'none',
        aspectRatio: aspectRatio,
      }}
    >
      {/* PHOTO WINDOW
          Matches the transparent opening inside frameImageUrl
      */}
      <div
        ref={containerRef}
        className={`absolute overflow-hidden touch-none ${
          isInteractive ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          left: `${photoArea.left}%`,
          top: `${photoArea.top}%`,
          width: `${photoArea.width}%`,
          height: `${photoArea.height}%`,
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
          <div 
            onClick={(e) => {
              if (onUploadClick) {
                e.stopPropagation();
                onUploadClick();
              }
            }}
            className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900/40 cursor-pointer"
          >
            <span className="bg-neutral-900/80 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded shadow-md pointer-events-none">
              Tap to upload
            </span>
          </div>
        )}

        {/* Glass effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
      </div>

      {/* FRAME — ALWAYS ON TOP */}
      {frameImageUrl && (
        <img
          src={frameImageUrl}
          alt="Frame"
          draggable={false}
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-10"
        />
      )}

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
