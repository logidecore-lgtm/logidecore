export interface PhotoArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FrameSizeConfig {
  aspectRatio: string;
  photoArea: PhotoArea;
}

export interface FrameConfig {
  sizes: Record<string, FrameSizeConfig>;
  defaultPhotoArea: PhotoArea;
}

// Default photo viewport coordinates (matching standard plaster wall overlay)
export const DEFAULT_PHOTO_AREA: PhotoArea = {
  left: 26.5,
  top: 11,
  width: 47.4,
  height: 74.2,
};

// Size configurations mapping for products
export const FRAME_CONFIGS: Record<string, FrameConfig> = {
  'acrylic-portrait-photo-print': {
    sizes: {
      '8x12': {
        aspectRatio: '8/12',
        photoArea: { left: 26.5, top: 11, width: 47.4, height: 74.2 },
      },
      '12x18': {
        aspectRatio: '12/18',
        photoArea: { left: 26.5, top: 11, width: 47.4, height: 74.2 },
      },
      '18x24': {
        aspectRatio: '18/24',
        photoArea: { left: 26.5, top: 11, width: 47.4, height: 74.2 },
      },
      '8x8': {
        aspectRatio: '1/1',
        photoArea: { left: 26.5, top: 11, width: 47.4, height: 74.2 },
      },
      '12x12': {
        aspectRatio: '1/1',
        photoArea: { left: 26.5, top: 11, width: 47.4, height: 74.2 },
      },
    },
    defaultPhotoArea: DEFAULT_PHOTO_AREA,
  },
};

/**
 * Standardize various size labels (e.g. '8"x12" (A4)' or '12 * 12') into clean config keys (like '8x12' or '12x12')
 */
export function normalizeSizeKey(sizeStr: string): string {
  if (!sizeStr) return '';
  const clean = sizeStr.toLowerCase().replace(/"/g, '').replace(/\s+/g, '');
  const match = clean.match(/(\d+)(?:x|\*|by|&)(\d+)/);
  if (match) {
    return `${match[1]}x${match[2]}`;
  }
  return clean;
}

/**
 * Looks up frame size configuration. Falls back gracefully if product or size config is missing.
 */
export function getFrameSizeConfig(
  productSlug: string,
  selectedSize: string
): { aspectRatio: string; photoArea: PhotoArea } {
  const normSize = normalizeSizeKey(selectedSize);
  const config = FRAME_CONFIGS[productSlug];
  
  // Calculate dynamic aspect ratio from size string if config is missing
  let aspectRatio = '3/4';
  if (normSize) {
    const parts = normSize.split('x');
    if (parts.length === 2) {
      const w = parseInt(parts[0], 10);
      const h = parseInt(parts[1], 10);
      if (w > 0 && h > 0) {
        aspectRatio = `${w}/${h}`;
      }
    }
  }

  if (!config) {
    return {
      aspectRatio,
      photoArea: DEFAULT_PHOTO_AREA,
    };
  }

  const sizeConfig = config.sizes[normSize];
  if (!sizeConfig) {
    return {
      aspectRatio,
      photoArea: config.defaultPhotoArea || DEFAULT_PHOTO_AREA,
    };
  }

  return sizeConfig;
}

export interface ProductImage {
  imageUrl: string;
  altText?: string | null;
}

/**
 * Automatically finds the template overlay image (background-remove.png) from a list of product images
 */
export function findFrameImage(
  images: ProductImage[]
): ProductImage | undefined {
  if (!images) return undefined;
  return images.find((image) => {
    const url = image.imageUrl?.toLowerCase() || '';
    const alt = image.altText?.toLowerCase() || '';

    return (
      url.includes('background-remove.png') ||
      alt === 'background-remove.png'
    );
  });
}

/**
 * Resolves frame configuration dynamically, prioritizing DB configs and falling back gracefully.
 */
export function getFrameConfigForSize(
  product: any,
  selectedSize: string
): { aspectRatio: string; photoArea: PhotoArea; frameImageUrl: string } {
  const normSize = normalizeSizeKey(selectedSize);

  // 1. Try database-saved dynamic configuration
  const dbConfig = product?.frameConfigs?.find(
    (fc: any) => normalizeSizeKey(fc.size) === normSize
  );

  if (dbConfig && dbConfig.enabled) {
    const dbFrameUrl = dbConfig.frameImageUrl || '';
    const frameImageFromGallery = findFrameImage(product?.images || []);
    const resolvedFrameImageUrl =
      dbFrameUrl.toLowerCase().includes('background-remove') || dbFrameUrl.includes('.png')
        ? dbFrameUrl
        : frameImageFromGallery?.imageUrl || dbFrameUrl;

    return {
      aspectRatio: `${dbConfig.aspectRatioWidth}/${dbConfig.aspectRatioHeight}`,
      photoArea: {
        left: dbConfig.photoAreaLeft,
        top: dbConfig.photoAreaTop,
        width: dbConfig.photoAreaWidth,
        height: dbConfig.photoAreaHeight,
      },
      frameImageUrl: resolvedFrameImageUrl,
    };
  }

  // 2. Backward compatibility fallback: check hardcoded configurations & auto-detect frame images
  const localConfig = getFrameSizeConfig(product?.slug || '', selectedSize);
  const frameImage = findFrameImage(product?.images || []);
  const frameImageUrl = frameImage?.imageUrl || '';

  return {
    aspectRatio: localConfig.aspectRatio,
    photoArea: localConfig.photoArea,
    frameImageUrl,
  };
}

export interface MockupSizeConfig {
  filename: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Maps normalized frame sizes to their hand-held mockup coordinate percentages.
 */
export function getSizeMockupConfig(sizeStr: string): MockupSizeConfig | null {
  const norm = normalizeSizeKey(sizeStr);
  
  const mappings: Record<string, MockupSizeConfig> = {
    "8x12": {
      filename: "8 X 12 .png",
      left: 31.55,
      top: 31.86,
      width: 34.34,
      height: 52.81
    },
    "10x15": {
      filename: "10 X 15.png",
      left: 29.50,
      top: 29.80,
      width: 38.40,
      height: 57.60
    },
    "12x18": {
      filename: "12 X 18.png",
      left: 26.50,
      top: 26.80,
      width: 44.50,
      height: 66.80
    },
    "16x20": {
      filename: "16 X 20.png",
      left: 24.50,
      top: 28.50,
      width: 48.00,
      height: 60.00
    },
    "16x24": {
      filename: "16 X 24.png",
      left: 22.50,
      top: 22.80,
      width: 52.50,
      height: 78.80
    }
  };

  return mappings[norm] || null;
}
