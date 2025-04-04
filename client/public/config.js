/**
 * Portfolio Configuration
 * 
 * This file contains all the configuration for your 3D portfolio.
 * Edit this file to add, remove, or modify projects.
 */

// Portfolio Info
const portfolioConfig = {
  // Homepage settings (first page)
  homepage: {
    title: "My 3D Portfolio",
    description: "Welcome to my interactive 3D portfolio. Scroll down to explore my projects."
  },
  
  // Projects
  // Each project needs:
  // - id: Unique identifier
  // - title: Main heading text
  // - description: Paragraph text
  // - modelPath: Path to your 3D model file (.glb, .gltf, .fbx, or .obj format)
  // - modelScale: Size of the model (adjust as needed)
  projects: [
    // Project 1
    {
      id: 1,
      title: "Interactive Visualization",
      description: "An interactive 3D visualization of data using modern web technologies.",
      modelPath: "/models/project1.glb", // Place your .glb file in the /public/models/ folder
      modelScale: 1.5
    },
    
    // Project 2
    {
      id: 2,
      title: "Product Design",
      description: "3D product design featuring detailed modeling and realistic texturing.",
      modelPath: "/models/project2.glb",
      modelScale: 1.0
    },
    
    // Project 3
    {
      id: 3,
      title: "Architectural Concept",
      description: "Architectural visualization showing space and lighting concepts.",
      modelPath: "/models/project3.glb",
      modelScale: 1.2
    },
    
    // Project 4
    {
      id: 4,
      title: "Game Environment",
      description: "Game environment design demonstrating atmosphere and storytelling.",
      modelPath: "/models/project4.glb",
      modelScale: 0.8
    }
    
    // Add more projects by copying the format above
    // Remember to add a comma after each project except the last one
  ]
};

// Make configuration available globally
window.portfolioConfig = portfolioConfig;

// For backward compatibility with existing code
window.projectsData = [
  portfolioConfig.homepage,
  ...portfolioConfig.projects
];