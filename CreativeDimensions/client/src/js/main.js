import { initScene, resizeScene, updateCameraPosition, updateLighting, cameraSettings, sceneSettings } from './scene.js';
import { initBackgroundStars, transitionBackground } from './background.js';
import { loadModels, displayModel, resetModelRotations } from './models.js';
import { setupScrollHandler } from './scroll.js';
import { loadingManager, easeInOutCubic } from './utils.js';

// Main application state
const state = {
  currentIndex: 0,
  totalProjects: projectsData.length,
  isScrolling: false,
  loadingProgress: 0,
  isLoaded: false,
  scrollY: 0,
  targetScrollY: 0,
  scrollDirection: 0,
  maxScrollY: 0
};

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const progressFill = document.querySelector('.progress-fill');
const scrollIndicator = document.getElementById('scroll-indicator');
const infoTitle = document.getElementById('info-title');
const infoDescription = document.getElementById('info-description');
const navDots = document.getElementById('nav-dots');

// Initialize the application
async function init() {
  // Setup loading manager
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    state.loadingProgress = itemsLoaded / itemsTotal;
    progressFill.style.width = `${state.loadingProgress * 100}%`;
    console.log(`Loading: ${itemsLoaded}/${itemsTotal}`);
  };

  loadingManager.onLoad = () => {
    finishLoading();
  };
  
  function finishLoading() {
    state.isLoaded = true;
    console.log('Loading complete!');
    
    // Fade out loading screen
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
    
    // Show scroll indicator
    scrollIndicator.style.opacity = '1';
    
    // Initialize the first project
    updateProjectInfo(0);
  }

  // Calculate max scroll value based on the number of projects
  state.maxScrollY = (state.totalProjects - 1) * window.innerHeight;
  
  // Initialize Three.js scene with camera orbit controls
  const { scene, camera, renderer, orbitControls } = initScene();
  
  // Store scene components globally for access in other functions
  window.sceneComponents = { scene, camera, renderer, orbitControls };
  
  // Initialize star background
  const { stars, whitePlane } = initBackgroundStars(scene);
  
  // Load 3D models
  await loadModels(scene);
  
  // Create navigation dots
  createNavigationDots();
  
  // Manually trigger loading complete (in case the loadingManager doesn't fire)
  // Set a short timeout to ensure the UI has time to update
  setTimeout(() => {
    if (!state.isLoaded) {
      console.log('Manually completing loading process');
      finishLoading();
    }
  }, 1000);
  
  // Setup scroll handler
  setupScrollHandler(state, (scrollData) => {
    const { normalizedScroll, direction } = scrollData;
    
    // Update state
    state.scrollDirection = direction;
    
    // Calculate which project to show based on scroll position
    const newIndex = Math.min(
      Math.floor(normalizedScroll * state.totalProjects),
      state.totalProjects - 1
    );
    
    // If project index changed, update the UI
    if (newIndex !== state.currentIndex) {
      updateProjectInfo(newIndex);
    }
    
    // Update background transition
    transitionBackground(normalizedScroll, stars, whitePlane);
    
    // Update current model visibility
    displayModel(newIndex, normalizedScroll);
    
    // Handle homepage transition when scrolling
    const homepageInfoContainer = document.querySelector('.homepage .info-container');
    const homepageInfoBox = document.querySelector('.homepage .info-box');
    
    if (homepageInfoContainer && homepageInfoBox) {
      if (normalizedScroll > 0) {
        // Starting to scroll away from homepage
        const translateY = Math.min(normalizedScroll * 50, 30); // Max 30px up
        const scale = Math.max(1 - normalizedScroll * 0.15, 0.85); // Min scale 0.85
        const opacity = Math.max(1 - normalizedScroll * 1.5, 0); // Fade out faster
        
        homepageInfoBox.style.transform = `translateY(-${translateY}px) scale(${scale})`;
        homepageInfoBox.style.opacity = opacity;
        
        // If we're beyond the first 50% of the first scroll section, 
        // hide the homepage content entirely
        if (normalizedScroll > 0.5 / state.totalProjects) {
          homepageInfoContainer.style.pointerEvents = 'none';
        } else {
          homepageInfoContainer.style.pointerEvents = 'auto';
        }
      } else {
        // Reset to initial state when back at homepage
        homepageInfoBox.style.transform = 'translateY(0) scale(1)';
        homepageInfoBox.style.opacity = 1;
        homepageInfoContainer.style.pointerEvents = 'auto';
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    resizeScene(renderer, camera);
    state.maxScrollY = (state.totalProjects - 1) * window.innerHeight;
  });
  
  // Animation loop
  let lastTime = 0;
  function animate(time) {
    requestAnimationFrame(animate);
    
    // Calculate delta time for smooth animations
    const deltaTime = (time - lastTime) / 1000; // Convert to seconds
    lastTime = time;
    
    // Use a reasonable delta time in case of large gaps (like tab switching)
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    // Smooth scrolling animation
    if (Math.abs(state.targetScrollY - state.scrollY) > 0.1) {
      state.scrollY += (state.targetScrollY - state.scrollY) * 0.1;
    }
    
    // Only enable camera rotation when not on homepage
    cameraSettings.active = state.currentIndex !== 0;
    
    // Disable camera orbit on homepage and enable it for project pages
    if (state.currentIndex > 0) {
      // Reset models to default rotation
      resetModelRotations();
      
      // Update camera position to orbit around the model
      updateCameraPosition(camera, orbitControls, clampedDelta);
      
      // Set orbit target to center of the displayed model
      orbitControls.target.set(0, 0, 0);
    } else {
      // Reset camera to default front view position for homepage
      camera.position.set(0, cameraSettings.orbitHeight, cameraSettings.orbitDistance);
      camera.lookAt(0, 0, 0);
    }
    
    // Render the scene
    renderer.render(scene, camera);
  }
  
  // Start animation loop
  animate();
}

// Create navigation dots for projects
function createNavigationDots() {
  for (let i = 0; i < state.totalProjects; i++) {
    const dot = document.createElement('div');
    dot.className = i === 0 ? 'nav-dot active' : 'nav-dot';
    dot.dataset.index = i;
    
    // Add click event to navigate to the project
    dot.addEventListener('click', () => {
      const targetScroll = (i / (state.totalProjects - 1)) * state.maxScrollY;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
    
    navDots.appendChild(dot);
  }
}

// Update project information
function updateProjectInfo(index) {
  if (index >= 0 && index < state.totalProjects) {
    // Update state
    state.currentIndex = index;
    
    // Get project data
    const project = projectsData[index];
    
    // Animate text change
    animateTextChange(infoTitle, project.title);
    animateTextChange(infoDescription, project.description);
    
    // Update navigation dots
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    // Add or remove homepage class from portfolio-container based on index
    const portfolioContainer = document.querySelector('.portfolio-container');
    
    // Update the scene's background color and lighting based on the current index
    const { scene } = window.sceneComponents || {};
    if (scene) {
      if (index === 0) {
        // Dark background and lighting for homepage
        scene.background = sceneSettings.darkBackground;
        portfolioContainer.classList.add('homepage');
        
        // Update lighting to dark mode
        updateLighting('dark');
        
        // Update text color for dark background
        document.documentElement.style.setProperty('--text-color', '#ffffff');
      } else {
        // Light background and lighting for project pages
        scene.background = sceneSettings.lightBackground;
        portfolioContainer.classList.remove('homepage');
        
        // Update lighting to light mode
        updateLighting('light');
        
        // Update text color for light background
        document.documentElement.style.setProperty('--text-color', '#333333');
      }
    }
    
    // Hide scroll indicator after first scroll
    if (index > 0) {
      scrollIndicator.style.opacity = '0';
    }
  }
}

// Animate text change with a fade effect
function animateTextChange(element, newText) {
  // Fade out
  element.style.opacity = '0';
  
  // Change text after fade out
  setTimeout(() => {
    element.textContent = newText;
    // Fade in
    element.style.opacity = '1';
  }, 300);
}

// Wait for resources to load
window.addEventListener('load', init);

// Export for use in other modules
export { state };
