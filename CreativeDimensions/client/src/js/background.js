import { loadingManager } from './utils.js';

// Store background elements
let starField;
let whiteBackgroundPlane;

// Initialize the star background
function initBackgroundStars(scene) {
  // Create a star field for the background
  const starCount = 1000;
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Create stars in a sphere around the camera
    const radius = 50 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);
    
    // Vary star sizes for more realism
    starSizes[i] = Math.random() * 2 + 0.5;
  }
  
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  
  // Create custom star material with a simple shader
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: { value: createStarTexture() }
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = vec3(1.0, 1.0, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(color * vColor, 1.0);
        gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  
  // Create star particles
  starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  
  // Create a white background plane that will be revealed on scroll
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xf8f8f8, // Slightly softer white that's easier on the eyes
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    toneMapped: false // Prevent tone mapping which can make white look off-white/beige
  });
  
  whiteBackgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
  whiteBackgroundPlane.position.z = -100;
  scene.add(whiteBackgroundPlane);
  
  return { stars: starField, whitePlane: whiteBackgroundPlane };
}

// Create a circular texture for the stars
function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

// Transition background based on scroll position
function transitionBackground(normalizedScroll, stars, whitePlane) {
  if (stars && whitePlane) {
    // Quick transition - fade out stars completely after the first 30% of scroll
    const starOpacity = normalizedScroll > 0.3 ? 0 : 1 - (normalizedScroll / 0.3);
    stars.material.opacity = starOpacity;
    
    // Quick transition - fade in white background immediately after the first page
    // First project is fully visible at normalizedScroll = 1/totalProjects
    const projects = window.projectsData?.length || 5; // Default to 5 if not set
    const firstProjectThreshold = 1 / projects;
    
    // Faster transition - fully white by the time we reach the first project
    whitePlane.material.opacity = Math.min(normalizedScroll / firstProjectThreshold, 1);
    
    // Also slowly move stars back as scroll progresses
    stars.position.z = -normalizedScroll * 50;
  }
}

export { initBackgroundStars, transitionBackground };
