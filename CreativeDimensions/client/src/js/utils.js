// Create a shared loading manager for all assets
const loadingManager = new THREE.LoadingManager();

// Easing function for smoother transitions
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Lerp function for linear interpolation
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// Map a value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Clamp a value between a min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Calculate distance between two 3D points
function distance(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) + 
    Math.pow(y2 - y1, 2) + 
    Math.pow(z2 - z1, 2)
  );
}

// Detect the user's device type
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

// Detect browser support for WebGL
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Handle "wheel" event with normalized deltas across browsers
function normalizeWheel(event) {
  const PIXEL_STEP = 10;
  const LINE_HEIGHT = 40;
  const PAGE_HEIGHT = 800;

  let sX = 0, sY = 0;
  
  // Legacy
  if ('detail' in event) {
    sY = event.detail;
  }
  if ('wheelDelta' in event) {
    sY = -event.wheelDelta / 120;
  }
  if ('wheelDeltaY' in event) {
    sY = -event.wheelDeltaY / 120;
  }
  if ('wheelDeltaX' in event) {
    sX = -event.wheelDeltaX / 120;
  }

  // Side scrolling on FF with DOMMouseScroll
  if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }
  
  // Calculate pixels scrolled
  let pixelX = sX * PIXEL_STEP;
  let pixelY = sY * PIXEL_STEP;

  // Get delta mode
  if ('deltaY' in event) {
    pixelY = event.deltaY;
  }
  if ('deltaX' in event) {
    pixelX = event.deltaX;
  }

  if ((pixelX || pixelY) && event.deltaMode) {
    if (event.deltaMode === 1) { // Delta in line height
      pixelX *= LINE_HEIGHT;
      pixelY *= LINE_HEIGHT;
    } else {  // Delta in page height
      pixelX *= PAGE_HEIGHT;
      pixelY *= PAGE_HEIGHT;
    }
  }

  return { pixelX, pixelY };
}

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Preload an image
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export { 
  loadingManager, 
  easeInOutCubic, 
  lerp, 
  mapRange, 
  clamp, 
  distance, 
  isMobile, 
  checkWebGLSupport,
  normalizeWheel,
  debounce,
  preloadImage
};
