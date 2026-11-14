/**
 * Image processing utilities for client-side compression and resizing.
 * Uses WebP (with JPEG fallback) and adaptive quality reduction so uploaded logos
 * and license certificates remain crisp while staying well under Firestore's 1MB document limit.
 */

const MAX_DATA_URL_LENGTH = 180_000; // ~135KB binary per image

const encodeCanvas = (
  canvas: HTMLCanvasElement,
  mimeType: 'image/webp' | 'image/jpeg',
  quality: number
): string => {
  const result = canvas.toDataURL(mimeType, quality);
  // Some browsers fall back to PNG if WebP encoding isn't supported
  if (mimeType === 'image/webp' && !result.startsWith('data:image/webp')) {
    return canvas.toDataURL('image/jpeg', quality);
  }
  return result;
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
      const img = new Image();
      img.onload = () => {
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
          resolve(rawDataUrl);
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Try WebP first (supports alpha transparency & high compression)
        let currentQuality = quality;
        let output = encodeCanvas(canvas, 'image/webp', currentQuality);

        // Adaptively lower quality if still large
        while (output.length > MAX_DATA_URL_LENGTH && currentQuality > 0.35) {
          currentQuality = Math.max(0.35, currentQuality - 0.15);
          output = encodeCanvas(canvas, 'image/webp', currentQuality);
        }

        // If still over budget, scale down dimensions once more
        if (output.length > MAX_DATA_URL_LENGTH && (canvas.width > 420 || canvas.height > 420)) {
          const scale = 0.7;
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = Math.max(1, Math.round(canvas.width * scale));
          smallCanvas.height = Math.max(1, Math.round(canvas.height * scale));
          const smallCtx = smallCanvas.getContext('2d');
          if (smallCtx) {
            smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            output = encodeCanvas(smallCanvas, 'image/webp', 0.72);
          }
        }

        resolve(output);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
