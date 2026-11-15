export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/heic',
  'image/heif'
];

/**
 * Validates file MIME type and file size.
 * Rejects non-image formats or files larger than 5 MB.
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file selected. Please select an image file.'
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected file is empty. Please select a valid image file.'
    };
  }

  // Reject files larger than 5 MB before processing
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeInMb} MB). Maximum allowed size is 5 MB.`
    };
  }

  // Accept only valid image MIME types
  const typeLower = (file.type || '').toLowerCase();
  const isImage = typeLower.startsWith('image/') || SUPPORTED_IMAGE_MIME_TYPES.includes(typeLower);
  if (!typeLower || !isImage) {
    return {
      valid: false,
      error: 'Unsupported file format. Please select an image file (e.g. JPG, PNG, or WebP).'
    };
  }

  return { valid: true };
}

/**
 * Resizes an image to a maximum dimension of 800px while preserving aspect ratio,
 * and encodes it as a JPEG with approximately 0.7 quality.
 * Handles errors gracefully by falling back to the original source.
 */
export async function compressImage(
  source: File | Blob | string,
  maxDimension = 800,
  quality = 0.7
): Promise<string> {
  // If remote URL preset (not data/blob), return as-is
  if (typeof source === 'string' && !source.startsWith('data:') && !source.startsWith('blob:')) {
    return source;
  }

  return new Promise((resolve) => {
    let sourceUrl = '';
    let isCreatedObjectUrl = false;

    if (typeof source === 'string') {
      sourceUrl = source;
    } else {
      try {
        sourceUrl = URL.createObjectURL(source);
        isCreatedObjectUrl = true;
      } catch {
        // Fallback to FileReader if createObjectURL is unavailable
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            compressDataUrl(e.target.result as string, maxDimension, quality)
              .then(resolve)
              .catch(() => resolve(e.target?.result as string));
          } else {
            resolve('');
          }
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(source);
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
          resolve(sourceUrl);
          return;
        }

        // Preserve aspect ratio while constraining to maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
          resolve(sourceUrl);
          return;
        }

        // Fill background with white for transparent images converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
        resolve(sourceUrl);
      }
    };

    img.onerror = (err) => {
      console.warn('Image load failed during compression:', err);
      if (isCreatedObjectUrl) URL.revokeObjectURL(sourceUrl);
      resolve(typeof source === 'string' ? source : '');
    };

    img.src = sourceUrl;
  });
}

function compressDataUrl(dataUrl: string, maxDimension: number, quality: number): Promise<string> {
  return compressImage(dataUrl, maxDimension, quality);
}
