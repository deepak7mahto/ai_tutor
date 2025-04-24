// Image compression options
const DEFAULT_OPTIONS = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.8,
  mimeType: 'image/webp'
};

/**
 * Compresses an image file using canvas
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<string>} Base64 string of compressed image
 */
async function compressImage(file, options = {}) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const aspectRatio = width / height;
        
        if (width > settings.maxWidth) {
          width = settings.maxWidth;
          height = Math.round(width / aspectRatio);
        }
        
        if (height > settings.maxHeight) {
          height = settings.maxHeight;
          width = Math.round(height * aspectRatio);
        }
        
        // Create canvas and context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const base64String = canvas.toDataURL(settings.mimeType, settings.quality);
        resolve(base64String);
      };
      
      img.onerror = (error) => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = (error) => {
      reject(new Error('Failed to read file'));
    };
  });
}

/**
 * Validates if a file is an image and meets size requirements
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {boolean} Whether the file is valid
 */
function validateImage(file, maxSizeMB = 10) {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    console.error('File is not an image');
    return false;
  }
  
  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    console.error(`File size exceeds ${maxSizeMB}MB limit`);
    return false;
  }
  
  return true;
}

/**
 * Handles file input change and compresses selected image
 * @param {Event} event - The change event from file input
 * @returns {Promise<string>} Base64 string of compressed image
 */
async function handleImageSelect(event) {
  const file = event.target.files[0];
  
  if (!file || !validateImage(file)) {
    throw new Error('Invalid image file');
  }
  
  try {
    const compressedImage = await compressImage(file);
    return compressedImage;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
}
