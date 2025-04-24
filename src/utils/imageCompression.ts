import sharp from 'sharp';

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp';
}

export async function compressImage(
  imageBuffer: Buffer,
  options: CompressImageOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    let processor = sharp(imageBuffer);
    
    // Get image metadata
    const metadata = await processor.metadata();
    
    if (metadata.width && metadata.height) {
      // Calculate aspect ratio
      const aspectRatio = metadata.width / metadata.height;
      
      // Determine new dimensions while maintaining aspect ratio
      let newWidth = metadata.width;
      let newHeight = metadata.height;
      
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = Math.round(maxWidth / aspectRatio);
      }
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = Math.round(maxHeight * aspectRatio);
      }
      
      processor = processor.resize(newWidth, newHeight);
    }

    // Convert to specified format with quality setting
    if (format === 'webp') {
      processor = processor.webp({ quality });
    } else {
      processor = processor.jpeg({ quality });
    }

    return await processor.toBuffer();
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
}

export function isBase64Image(str: string): boolean {
  if (!str) return false;
  // Check if string is a data URL
  if (str.startsWith('data:image/')) {
    return true;
  }
  // Check if string is a base64 encoded image
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch {
    return false;
  }
}

export function extractBase64Data(dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  return match ? match[1] : dataUrl;
}
