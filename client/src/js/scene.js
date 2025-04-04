import { loadingManager } from './utils.js';

// Camera settings
const cameraSettings = {
  orbitSpeed: 0.5,
  orbitDistance: 5,
  orbitHeight: 1,
  active: true
};

// Scene settings
const sceneSettings = {
  darkBackground: new THREE.Color(0x000000),
  lightBackground: new THREE.Color(0xffffff)
};

// Initialize the Three.js scene
function initScene() {
  // Create scene (starts with dark background for homepage)
  const scene = new THREE.Scene();
  scene.background = sceneSettings.darkBackground;

  // Create camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = cameraSettings.orbitHeight;

  // Create orbit controls
  const orbitControls = {
    angle: 0,
    updating: true,
    target: new THREE.Vector3(1, 0, 0) // Target the model position
  };

  // Create renderer
  const canvas = document.getElementById('portfolio-canvas');
  const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true,
    alpha: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9; // Reduced exposure for more comfortable viewing
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add lighting
  setupLighting(scene);

  // Return the created components
  return { scene, camera, renderer, orbitControls };
}

// Lighting settings
const lightingSettings = {
  dark: {
    ambientIntensity: 0.5,
    mainIntensity: 1.0,
    fillIntensity: 0.6,
    rimIntensity: 0.3
  },
  light: {
    ambientIntensity: 0.7,   // Softer ambient for easier viewing
    mainIntensity: 1.0,      // Reduced key light intensity to be gentler on eyes
    fillIntensity: 0.7,      // Softer fill light for more comfortable viewing
    rimIntensity: 0.4        // Subtle rim light that's still visible but not too intense
  }
};

// Store lights as global variables so they can be adjusted later
const lights = {
  ambient: null,
  main: null,
  fill: null,
  rim: null
};

// Setup scene lighting
function setupLighting(scene) {
  // Ambient light
  lights.ambient = new THREE.AmbientLight(0xffffff, lightingSettings.dark.ambientIntensity);
  scene.add(lights.ambient);

  // Main directional light (simulates sunlight)
  lights.main = new THREE.DirectionalLight(0xffffff, lightingSettings.dark.mainIntensity);
  lights.main.position.set(10, 10, 10);
  lights.main.castShadow = true;
  lights.main.shadow.mapSize.width = 2048;
  lights.main.shadow.mapSize.height = 2048;
  lights.main.shadow.camera.near = 0.5;
  lights.main.shadow.camera.far = 50;
  lights.main.shadow.camera.left = -10;
  lights.main.shadow.camera.right = 10;
  lights.main.shadow.camera.top = 10;
  lights.main.shadow.camera.bottom = -10;
  scene.add(lights.main);

  // Fill light from the opposite side - more neutral color for accurate rendering on white
  lights.fill = new THREE.DirectionalLight(0xf5f5ff, lightingSettings.dark.fillIntensity);
  lights.fill.position.set(-10, 5, -10);
  scene.add(lights.fill);

  // Rim light for better definition against white background
  lights.rim = new THREE.DirectionalLight(0xf0f8ff, lightingSettings.dark.rimIntensity);
  lights.rim.position.set(0, -10, -15);
  scene.add(lights.rim);
  
  return lights;
}

// Update lighting mode (dark for homepage, light for projects)
function updateLighting(mode = 'dark') {
  if (!lights.ambient) return;
  
  const settings = mode === 'dark' ? lightingSettings.dark : lightingSettings.light;
  
  // Update light intensities
  lights.ambient.intensity = settings.ambientIntensity;
  lights.main.intensity = settings.mainIntensity;
  lights.fill.intensity = settings.fillIntensity;
  lights.rim.intensity = settings.rimIntensity;
}

// Resize handler for responsive rendering
function resizeScene(renderer, camera) {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Create a display platform for the 3D models
function createModelPlatform(scene) {
  // Create a white plane to display models on
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf8f8f8, // Slightly softer white that's easier on the eyes
    side: THREE.DoubleSide,
    roughness: 0.2, // Slightly higher roughness to diffuse light better
    metalness: 0.0, // Remove metalness to avoid color tinting
    toneMapped: false // Prevent tone mapping which can make white look beige
  });
  
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1.5;
  plane.receiveShadow = true;
  
  scene.add(plane);
  
  return plane;
}

// Update the camera position to orbit around the model
function updateCameraPosition(camera, orbitControls, deltaTime) {
  if (!cameraSettings.active) return;
  
  // Update the camera angle
  orbitControls.angle += cameraSettings.orbitSpeed * deltaTime;
  
  // Calculate new camera position in a circle around the target
  const x = orbitControls.target.x + Math.sin(orbitControls.angle) * cameraSettings.orbitDistance;
  const z = orbitControls.target.z + Math.cos(orbitControls.angle) * cameraSettings.orbitDistance;
  
  // Set the camera position
  camera.position.x = x;
  camera.position.z = z;
  camera.position.y = cameraSettings.orbitHeight;
  
  // Make camera look at the target
  camera.lookAt(orbitControls.target);
}

export { initScene, resizeScene, createModelPlatform, updateCameraPosition, updateLighting, cameraSettings, sceneSettings };
