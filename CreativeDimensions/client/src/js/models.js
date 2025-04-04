import { loadingManager } from './utils.js';
import { createModelPlatform } from './scene.js';

// Make sure projectsData is accessible
// This references the global projectsData defined in config.js
const projectsData = window.projectsData || [
  { id: 1, title: "Project 1", description: "Description 1", modelScale: 1.5 },
  { id: 2, title: "Project 2", description: "Description 2", modelScale: 1.0 },
  { id: 3, title: "Project 3", description: "Description 3", modelScale: 1.2 },
  { id: 4, title: "Project 4", description: "Description 4", modelScale: 0.8 }
];

// Get projects configuration (excluding homepage)
const projectsConfig = window.portfolioConfig?.projects || [];

// Store loaded models and platforms
const models = [];
let displayPlatform;
let rotationSpeeds = []; // Store rotation speeds for continuous rotation

/**
 * Load 3D models from configuration
 * @param {THREE.Scene} scene - The Three.js scene to add models to
 * @returns {Array} - Array of loaded models
 */
async function loadModels(scene) {
  // Create display platform
  displayPlatform = createModelPlatform(scene);
  
  // Try to load models from config
  let hasLoadedCustomModels = false;
  
  if (projectsConfig.length > 0) {
    try {
      // Set up different model loaders
      const gltfLoader = new THREE.GLTFLoader(loadingManager);
      const fbxLoader = new THREE.FBXLoader(loadingManager);
      const objLoader = new THREE.OBJLoader(loadingManager);
      const mtlLoader = new THREE.MTLLoader(loadingManager);
      
      // For each project in config, try to load its model
      for (const project of projectsConfig) {
        if (project.modelPath) {
          try {
            console.log(`Loading model from: ${project.modelPath}`);
            let model;
            
            // Determine which loader to use based on file extension
            const extension = project.modelPath.split('.').pop().toLowerCase();
            
            if (extension === 'glb' || extension === 'gltf') {
              // Load GLB/GLTF model
              const result = await gltfLoader.loadAsync(project.modelPath);
              model = result.scene;
            } 
            else if (extension === 'fbx') {
              // Load FBX model
              model = await fbxLoader.loadAsync(project.modelPath);
            } 
            else if (extension === 'obj') {
              // Check if there's a corresponding MTL file
              const mtlPath = project.modelPath.replace('.obj', '.mtl');
              
              try {
                // Try to load MTL file if it exists
                const materials = await mtlLoader.loadAsync(mtlPath);
                materials.preload();
                objLoader.setMaterials(materials);
              } catch (mtlError) {
                console.log('No MTL file found or error loading it, using default materials');
              }
              
              // Load OBJ model
              model = await objLoader.loadAsync(project.modelPath);
            } 
            else {
              throw new Error(`Unsupported model format: ${extension}`);
            }
            
            // Setup the loaded model
            model.position.set(1, 0, 0);
            model.visible = false;
            model.castShadow = true;
            
            // Apply scale if specified
            if (project.modelScale) {
              const scale = project.modelScale;
              model.scale.set(scale, scale, scale);
            }
            
            scene.add(model);
            models.push(model);
            hasLoadedCustomModels = true;
            
          } catch (modelError) {
            console.warn(`Failed to load model ${project.modelPath}:`, modelError);
          }
        }
      }
    } catch (error) {
      console.warn("Error setting up model loaders:", error);
    }
  }
  
  // If no custom models were loaded, use placeholder models
  if (!hasLoadedCustomModels) {
    console.log("Using placeholder models instead");
    createPlaceholderModels(scene);
  }
  
  return models;
}

// Create placeholder models for demonstration
function createPlaceholderModels(scene) {
  // Model 1: A cube with complex materials
  const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    metalness: 0.7,
    roughness: 0.2
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(1, 0, 0);
  cube.castShadow = true;
  scene.add(cube);
  cube.visible = false;
  models.push(cube);

  // Model 2: A torus knot
  const torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
  const torusKnotMaterial = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    metalness: 0.3,
    roughness: 0.6
  });
  const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
  torusKnot.position.set(1, 0, 0);
  torusKnot.castShadow = true;
  scene.add(torusKnot);
  torusKnot.visible = false;
  models.push(torusKnot);

  // Model 3: A dodecahedron
  const dodecahedronGeometry = new THREE.DodecahedronGeometry(1, 0);
  const dodecahedronMaterial = new THREE.MeshStandardMaterial({
    color: 0x2ecc71,
    metalness: 0.1,
    roughness: 0.8
  });
  const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
  dodecahedron.position.set(1, 0, 0);
  dodecahedron.castShadow = true;
  scene.add(dodecahedron);
  dodecahedron.visible = false;
  models.push(dodecahedron);

  // Model 4: An icosahedron
  const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);
  const icosahedronMaterial = new THREE.MeshStandardMaterial({
    color: 0xf39c12,
    metalness: 0.5,
    roughness: 0.4
  });
  const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
  icosahedron.position.set(1, 0, 0);
  icosahedron.castShadow = true;
  scene.add(icosahedron);
  icosahedron.visible = false;
  models.push(icosahedron);
  
  // For a fifth model, create a heart-like shape using primitive geometries
  // This ensures we don't need to rely on external GLTF loading
  const heartGroup = new THREE.Group();
  
  // Create two spheres for the main part of the heart
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const heartMaterial = new THREE.MeshStandardMaterial({
    color: 0xff69b4,
    metalness: 0.4,
    roughness: 0.6
  });
  
  const leftSphere = new THREE.Mesh(sphereGeometry, heartMaterial);
  leftSphere.position.set(-0.25, 0, 0);
  heartGroup.add(leftSphere);
  
  const rightSphere = new THREE.Mesh(sphereGeometry, heartMaterial);
  rightSphere.position.set(0.25, 0, 0);
  heartGroup.add(rightSphere);
  
  // Create a cone for the bottom part of the heart
  const coneGeometry = new THREE.ConeGeometry(0.7, 1, 32);
  const cone = new THREE.Mesh(coneGeometry, heartMaterial);
  cone.position.set(0, -0.5, 0);
  cone.rotation.z = Math.PI; // Flip the cone
  heartGroup.add(cone);
  
  // Position the entire heart group
  heartGroup.position.set(1, 0, 0);
  heartGroup.scale.set(0.7, 0.7, 0.7);
  heartGroup.castShadow = true;
  scene.add(heartGroup);
  heartGroup.visible = false;
  models.push(heartGroup);
}

// Display the appropriate model based on scroll position
function displayModel(index, normalizedScroll) {
  // Special case for homepage (index 0) - hide all models
  if (index === 0) {
    models.forEach(model => {
      model.visible = false;
    });
    
    // Keep platform black for the homepage
    if (displayPlatform) {
      const color = new THREE.Color(0, 0, 0);
      displayPlatform.material.color = color;
    }
    return;
  }
  
  // For other pages, show the appropriate model
  models.forEach((model, i) => {
    // Adjust index to account for the homepage having no model
    // Models start from index 1 (subtract 1 to align with models array)
    const modelIndex = i + 1;
    
    // Determine if this model should be visible
    const isVisible = index === modelIndex;
    
    model.visible = isVisible;
    
    if (isVisible) {
      // Calculate progress for animation based on scroll within this section
      // Normalize scroll is 0-1 across all sections, so we need to adjust
      // Each section is 1/totalProjects in size
      const sectionSize = 1 / projectsData.length;
      const sectionStart = index * sectionSize;
      const subProgress = (normalizedScroll - sectionStart) / sectionSize;
      
      // Animate the model based on subProgress
      animateModel(model, subProgress, i);
      
      // Set scale based on project data if available
      let scale = 1;
      if (projectsData && projectsData[i] && projectsData[i].modelScale) {
        scale = projectsData[i].modelScale;
      }
      model.scale.set(scale, scale, scale);
    }
  });
  
  // Transition the platform from black to white based on scroll
  if (displayPlatform) {
    const color = new THREE.Color();
    // Start with black and transition to white
    color.setRGB(normalizedScroll, normalizedScroll, normalizedScroll);
    displayPlatform.material.color = color;
  }
}

// Animate the model based on sub-progress
function animateModel(model, progress, index) {
  // Apply different animations based on the model index
  switch (index % 4) {
    case 0:
      // Rotation animation
      model.rotation.y = progress * Math.PI * 2;
      break;
    case 1:
      // Floating animation
      model.position.y = Math.sin(progress * Math.PI) * 0.5;
      model.rotation.y = progress * Math.PI;
      break;
    case 2:
      // Scale pulse animation
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
      model.scale.set(scale, scale, scale);
      model.rotation.y = progress * Math.PI * 4;
      break;
    case 3:
      // Complex rotation
      model.rotation.x = progress * Math.PI;
      model.rotation.y = progress * Math.PI * 2;
      model.rotation.z = progress * Math.PI / 2;
      break;
  }
}

// Reset all model rotations to default
function resetModelRotations() {
  models.forEach(model => {
    if (model.rotation) {
      model.rotation.x = 0;
      model.rotation.y = 0;
      model.rotation.z = 0;
    }
  });
}

export { loadModels, displayModel, resetModelRotations };
