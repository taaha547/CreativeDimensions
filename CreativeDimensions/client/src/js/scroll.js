import { normalizeWheel, mapRange, clamp, debounce } from './utils.js';

// Store scroll-related variables
let scrollY = 0;
let targetScrollY = 0;
let previousScrollY = 0;
let scrollThreshold = 60; // Threshold for detecting scroll direction
let isScrolling = false;

// Set up the scroll event handler
function setupScrollHandler(state, callback) {
  // Activate virtual scroll
  window.addEventListener('wheel', handleScroll, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // Update scroll position on scroll
  window.addEventListener('scroll', () => {
    state.targetScrollY = window.scrollY;
  });
  
  // Handle mouse wheel scrolling
  function handleScroll(event) {
    event.preventDefault();
    
    if (isScrolling) return;
    
    const normalized = normalizeWheel(event);
    
    // Update scroll position
    targetScrollY = clamp(
      targetScrollY + normalized.pixelY,
      0,
      state.maxScrollY
    );
    
    // Determine scroll direction
    const direction = targetScrollY > previousScrollY ? 1 : -1;
    previousScrollY = targetScrollY;
    
    // Update window scroll position (for native scrolling)
    window.scrollTo(0, targetScrollY);
    
    // Calculate normalized scroll (0 to 1)
    const normalizedScroll = mapRange(targetScrollY, 0, state.maxScrollY, 0, 1);
    
    // Call the callback with scroll data
    callback({
      scrollY: targetScrollY,
      normalizedScroll,
      direction,
    });
    
    // Debounce scrolling flag
    isScrolling = true;
    setTimeout(() => {
      isScrolling = false;
    }, 50);
  }
  
  // Touch handling variables
  let touchStartY = 0;
  let touchMoveY = 0;
  
  // Handle touch start
  function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
  }
  
  // Handle touch move
  function handleTouchMove(event) {
    event.preventDefault();
    
    if (isScrolling) return;
    
    touchMoveY = event.touches[0].clientY;
    const diff = touchStartY - touchMoveY;
    
    // Only update if the movement is significant
    if (Math.abs(diff) > 5) {
      // Update scroll position
      targetScrollY = clamp(
        targetScrollY + diff,
        0,
        state.maxScrollY
      );
      
      // Determine scroll direction
      const direction = diff > 0 ? 1 : -1;
      previousScrollY = targetScrollY;
      
      // Update window scroll position (for native scrolling)
      window.scrollTo(0, targetScrollY);
      
      // Calculate normalized scroll (0 to 1)
      const normalizedScroll = mapRange(targetScrollY, 0, state.maxScrollY, 0, 1);
      
      // Call the callback with scroll data
      callback({
        scrollY: targetScrollY,
        normalizedScroll,
        direction,
      });
      
      // Reset touch start position
      touchStartY = touchMoveY;
      
      // Debounce scrolling flag
      isScrolling = true;
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    }
  }
  
  // Handle touch end
  function handleTouchEnd() {
    // Momentum scrolling could be added here
  }
  
  // Handle resize events
  window.addEventListener('resize', debounce(() => {
    // Recalculate max scroll
    state.maxScrollY = (state.totalProjects - 1) * window.innerHeight;
    
    // Ensure current scroll is within bounds
    targetScrollY = clamp(targetScrollY, 0, state.maxScrollY);
    window.scrollTo(0, targetScrollY);
    
    // Calculate normalized scroll
    const normalizedScroll = mapRange(targetScrollY, 0, state.maxScrollY, 0, 1);
    
    // Call the callback with updated scroll data
    callback({
      scrollY: targetScrollY,
      normalizedScroll,
      direction: 0,
    });
  }, 200));
  
  // Initialize scroll position
  window.scrollTo(0, 0);
  
  return { 
    getScrollY: () => scrollY,
    getTargetScrollY: () => targetScrollY
  };
}

export { setupScrollHandler };
