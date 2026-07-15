// src/lib/image.ts
//
// Utility for client-side image compression and metadata extraction.
// Resizes images using canvas, aiming to keep them under 1MB, and
// handles clean memory cleanup to avoid mobile Safari crashes.

export interface CompressedImageResult {
  blob: Blob;
  width: number;
  height: number;
  capturedAt: Date;
}

export async function compressImage(file: File): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        // Keep aspect ratio but cap max dimensions to 1600px
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Perform compression with JPEG quality 0.75
        canvas.toBlob(
          (blob) => {
            // Clean up resources immediately to prevent memory leaks and mobile Safari crashes
            URL.revokeObjectURL(objectUrl);
            canvas.width = 0;
            canvas.height = 0;

            if (blob) {
              resolve({
                blob,
                width,
                height,
                capturedAt: new Date(file.lastModified),
              });
            } else {
              reject(new Error("Canvas export returned null blob"));
            }
          },
          "image/jpeg",
          0.75
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image into element"));
    };

    img.src = objectUrl;
  });
}
