/**
 * Image processing utilities for client-side compression and resizing.
 * Uses WebP (with JPEG fallback) and adaptive quality reduction so uploaded logos
 * and license certificates remain crisp while staying compact for Firestore & storage.
 */

const MAX_DATA_URL_LENGTH = 95_000; // ~70KB binary per image

const encodeCanvas = (
  canvas: HTMLCanvasElement,
  mimeType: 'image/webp' | 'image/jpeg',
  quality: number
): string => {
  const result = canvas.toDataURL(mimeType, quality);
  if (mimeType === 'image/webp' && !result.startsWith('data:image/webp')) {
    return canvas.toDataURL('image/jpeg', quality);
  }
  return result;
};

const compressImageElement = (
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  maxLen: number
): string => {
  let width = img.width || maxWidth;
  let height = img.height || maxHeight;
  if (width > maxWidth || height > maxHeight) {
    if (width > height) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    } else {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let currentQuality = quality;
  let output = encodeCanvas(canvas, 'image/webp', currentQuality);

  while (output.length > maxLen && currentQuality > 0.35) {
    currentQuality = Math.max(0.35, currentQuality - 0.15);
    output = encodeCanvas(canvas, 'image/webp', currentQuality);
  }

  if (output.length > maxLen && (canvas.width > 420 || canvas.height > 420)) {
    const scale = 0.65;
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = Math.max(1, Math.round(canvas.width * scale));
    smallCanvas.height = Math.max(1, Math.round(canvas.height * scale));
    const smallCtx = smallCanvas.getContext('2d');
    if (smallCtx) {
      smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
      output = encodeCanvas(smallCanvas, 'image/webp', 0.68);
    }
  }

  return output;
};

export const optimizeImageFile = (
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = (e.target?.result as string) || '';
      if (!rawDataUrl.startsWith('data:image/')) {
        reject(new Error('Unsupported file format. Please choose an image (PNG, JPG, WebP).'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          resolve(compressImageElement(img, maxWidth, maxHeight, quality, MAX_DATA_URL_LENGTH));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => {
        // Only allow small raw images (e.g. inline SVG) if browser img decoding fails
        if (rawDataUrl.length <= MAX_DATA_URL_LENGTH) {
          resolve(rawDataUrl);
        } else {
          reject(new Error('Could not process this image format. Try PNG or JPG.'));
        }
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.readAsDataURL(file);
  });
};

export const recompressDataUrlIfOversized = (
  dataUrl: string,
  maxWidth = 750,
  maxHeight = 750,
  maxLen = MAX_DATA_URL_LENGTH
): Promise<string> => {
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length <= maxLen) {
    return Promise.resolve(dataUrl);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        resolve(compressImageElement(img, maxWidth, maxHeight, 0.8, maxLen));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};
