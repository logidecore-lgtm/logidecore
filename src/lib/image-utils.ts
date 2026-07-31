/**
 * Client-side image compression helper using HTML5 Canvas.
 * Compresses file size (MB) while keeping the image clear.
 */
export function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<Blob | File> {
  return new Promise((resolve) => {
    // If the browser doesn't support FileReader or Canvas, return original file
    if (!window.FileReader || !window.HTMLCanvasElement) {
      resolve(file);
      return;
    }

    // Skip compression for non-images
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    // Don't compress very small files (e.g. less than 150KB)
    if (file.size < 150 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image onto canvas (resizes high-res images cleanly)
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a compressed JPEG Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File from Blob to retain the original filename
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
