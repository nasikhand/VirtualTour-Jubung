import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions untuk konversi koordinat virtual tour
export const coordinateUtils = {
  /**
   * Konversi koordinat 2D screen ke koordinat 3D sphere
   * @param x - Posisi X dalam pixel
   * @param y - Posisi Y dalam pixel
   * @param width - Lebar container
   * @param height - Tinggi container
   * @returns { pitch: number, yaw: number } - Koordinat sphere
   */
  screenToSphere: (x: number, y: number, width: number, height: number) => {
    // Normalize coordinates to [-1, 1]
    const normalizedX = (x / width) * 2 - 1;
    const normalizedY = (y / height) * 2 - 1;

    // Convert to spherical coordinates
    // Yaw: horizontal angle (-180 to 180 degrees)
    const yaw = normalizedX * 180;

    // Pitch: vertical angle (-90 to 90 degrees)
    // Invert Y axis and apply spherical projection
    const pitch = Math.asin(-normalizedY) * (180 / Math.PI);

    // Clamp values to valid ranges
    const clampedPitch = Math.max(-90, Math.min(90, pitch));
    const clampedYaw = ((yaw % 360) + 360) % 360 - 180;

    return { pitch: clampedPitch, yaw: clampedYaw };
  },

  /**
   * Konversi koordinat 3D sphere ke koordinat 2D screen
   * @param pitch - Pitch dalam derajat (-90 to 90)
   * @param yaw - Yaw dalam derajat (-180 to 180)
   * @param width - Lebar container
   * @param height - Tinggi container
   * @returns { x: number, y: number } - Koordinat screen
   */
  sphereToScreen: (pitch: number, yaw: number, width: number, height: number) => {
    // Normalize spherical coordinates to [-1, 1]
    const normalizedYaw = yaw / 180; // -180 to 180 -> -1 to 1
    const normalizedPitch = Math.sin((pitch * Math.PI) / 180); // -90 to 90 -> -1 to 1
    
    // Convert to screen coordinates
    const x = ((normalizedYaw + 1) / 2) * width; // -1 to 1 -> 0 to width
    const y = ((1 - normalizedPitch) / 2) * height; // -1 to 1 -> 0 to height (inverted Y)
    
    return { x, y };
  },

  /**
   * Konversi persentase ke koordinat sphere
   * @param xPercent - Posisi X dalam persentase (0-100)
   * @param yPercent - Posisi Y dalam persentase (0-100)
   * @param width - Lebar container
   * @param height - Tinggi container
   * @returns { pitch: number, yaw: number } - Koordinat sphere
   */
  percentToSphere: (xPercent: number, yPercent: number, width: number, height: number) => {
    const x = (xPercent / 100) * width;
    const y = (yPercent / 100) * height;
    return coordinateUtils.screenToSphere(x, y, width, height);
  },

  /**
   * Konversi koordinat sphere ke persentase
   * @param pitch - Pitch dalam derajat
   * @param yaw - Yaw dalam derajat
   * @param width - Lebar container
   * @param height - Tinggi container
   * @returns { x: number, y: number } - Koordinat dalam persentase
   */
  sphereToPercent: (pitch: number, yaw: number, width: number, height: number) => {
    const screenCoords = coordinateUtils.sphereToScreen(pitch, yaw, width, height);
    return {
      x: (screenCoords.x / width) * 100,
      y: (screenCoords.y / height) * 100
    };
  },

  /**
   * Validasi koordinat sphere
   * @param pitch - Pitch dalam derajat
   * @param yaw - Yaw dalam derajat
   * @returns boolean - True jika koordinat valid
   */
  isValidSphereCoords: (pitch: number, yaw: number) => {
    return !isNaN(pitch) && !isNaN(yaw) &&
           pitch >= -90 && pitch <= 90 &&
           yaw >= -180 && yaw <= 180;
  },

  /**
   * Normalisasi koordinat sphere ke range yang valid
   * @param pitch - Pitch dalam derajat
   * @param yaw - Yaw dalam derajat
   * @returns { pitch: number, yaw: number } - Koordinat yang dinormalisasi
   */
  normalizeSphereCoords: (pitch: number, yaw: number) => {
    const clampedPitch = Math.max(-90, Math.min(90, pitch));
    const normalizedYaw = ((yaw % 360) + 360) % 360 - 180;
    return { pitch: clampedPitch, yaw: normalizedYaw };
  }
};

// Utility untuk format tanggal
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Utility untuk format waktu
export const formatTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utility untuk truncate text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Utility untuk generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Utility untuk debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Utility untuk throttle function (performance optimization)
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};



