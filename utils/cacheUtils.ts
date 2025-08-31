/**
 * Utility functions untuk manajemen cache dan state
 */

// Clear browser cache untuk images
export const clearImageCache = () => {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('image') || name.includes('vtour')) {
          caches.delete(name);
        }
      });
    });
  }
};

// Clear localStorage untuk virtual tour
export const clearVtourStorage = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('vtour') || key.includes('logo') || key.includes('settings')) {
      localStorage.removeItem(key);
    }
  });
};

// Reset virtual tour state
export const resetVtourState = () => {
  clearImageCache();
  clearVtourStorage();
  
  // Force reload images
  const images = document.querySelectorAll('img[src*="vtour"]');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      const newSrc = src.includes('?') ? `${src}&t=${Date.now()}` : `${src}?t=${Date.now()}`;
      img.setAttribute('src', newSrc);
    }
  });
};

// Generate cache buster untuk URL
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

// Check if image exists
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
