/**
 * Creates a 64-bit difference hash (dHash) for local data-URL images.
 * It samples a 9×8 grayscale canvas and records horizontal pixel differences.
 * Remote URLs are intentionally ignored so hashing never depends on CORS.
 */
export function createImageDHash(dataUrl: string): Promise<string | undefined> {
  if (!dataUrl.startsWith('data:image/')) return Promise.resolve(undefined);

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 9;
        canvas.height = 8;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return resolve(undefined);

        context.drawImage(image, 0, 0, 9, 8);
        const pixels = context.getImageData(0, 0, 9, 8).data;
        let hash = 0n;

        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            const left = (y * 9 + x) * 4;
            const right = left + 4;
            const leftLuminance = pixels[left] * 299 + pixels[left + 1] * 587 + pixels[left + 2] * 114;
            const rightLuminance = pixels[right] * 299 + pixels[right + 1] * 587 + pixels[right + 2] * 114;
            hash = (hash << 1n) | (leftLuminance > rightLuminance ? 1n : 0n);
          }
        }

        resolve(hash.toString(16).padStart(16, '0'));
      } catch {
        resolve(undefined);
      }
    };
    image.onerror = () => resolve(undefined);
    image.src = dataUrl;
  });
}

/** Returns the number of differing bits between two 64-bit hexadecimal hashes. */
export function hammingDistance(leftHash: string, rightHash: string): number | undefined {
  if (!/^[a-f0-9]{16}$/i.test(leftHash) || !/^[a-f0-9]{16}$/i.test(rightHash)) return undefined;

  let distance = 0;
  for (let index = 0; index < 16; index++) {
    let difference = parseInt(leftHash[index], 16) ^ parseInt(rightHash[index], 16);
    while (difference) {
      distance += difference & 1;
      difference >>>= 1;
    }
  }
  return distance;
}
