/**
 * Portfolio Manager
 * 
 * This file provides an easy way to manage your 3D portfolio content
 * without having to edit the configuration file directly.
 */

// Initialize the portfolio manager
const PortfolioManager = {
  /**
   * Update homepage content
   * @param {Object} options - Homepage content options
   * @param {string} options.title - Homepage title
   * @param {string} options.description - Homepage description text
   */
  updateHomepage: function(options) {
    if (!window.portfolioConfig) {
      console.error("Portfolio config not found. Make sure config.js is loaded first.");
      return;
    }
    
    if (options.title) {
      window.portfolioConfig.homepage.title = options.title;
    }
    
    if (options.description) {
      window.portfolioConfig.homepage.description = options.description;
    }
    
    // Update the projectsData to maintain compatibility
    window.projectsData[0] = window.portfolioConfig.homepage;
    
    // If the page is currently showing the homepage, update the displayed text
    if (document.querySelector('.portfolio-container').classList.contains('homepage')) {
      const titleElement = document.getElementById('info-title');
      const descriptionElement = document.getElementById('info-description');
      
      if (titleElement && options.title) {
        titleElement.textContent = options.title;
      }
      
      if (descriptionElement && options.description) {
        descriptionElement.textContent = options.description;
      }
    }
  },
  
  /**
   * Add a new project to the portfolio
   * @param {Object} project - Project details
   * @param {string} project.title - Project title
   * @param {string} project.description - Project description
   * @param {string} project.modelPath - Path to the 3D model file (.glb, .gltf, .fbx, or .obj format)
   * @param {number} project.modelScale - Scale of the model (optional, default: 1)
   * @returns {number} The ID of the newly added project
   */
  addProject: function(project) {
    if (!window.portfolioConfig) {
      console.error("Portfolio config not found. Make sure config.js is loaded first.");
      return -1;
    }
    
    // Validate required fields
    if (!project.title || !project.description) {
      console.error("Project title and description are required.");
      return -1;
    }
    
    // Generate a new ID
    const newId = window.portfolioConfig.projects.length + 1;
    
    // Create the new project object
    const newProject = {
      id: newId,
      title: project.title,
      description: project.description,
      modelPath: project.modelPath || null,
      modelScale: project.modelScale || 1.0
    };
    
    // Add to projects array
    window.portfolioConfig.projects.push(newProject);
    
    // Update the projectsData to maintain compatibility
    window.projectsData = [
      window.portfolioConfig.homepage,
      ...window.portfolioConfig.projects
    ];
    
    console.log(`Added new project with ID ${newId}`);
    
    // Reload page to see changes (only way to properly update the navigation dots)
    if (project.reload !== false) {
      location.reload();
    }
    
    return newId;
  },
  
  /**
   * Update an existing project
   * @param {number} projectId - ID of the project to update
   * @param {Object} updates - Project details to update
   * @param {string} updates.title - Project title
   * @param {string} updates.description - Project description
   * @param {string} updates.modelPath - Path to the 3D model file (.glb, .gltf, .fbx, or .obj format)
   * @param {number} updates.modelScale - Scale of the model
   * @returns {boolean} Success status
   */
  updateProject: function(projectId, updates) {
    if (!window.portfolioConfig) {
      console.error("Portfolio config not found. Make sure config.js is loaded first.");
      return false;
    }
    
    // Find the project by ID
    const projectIndex = window.portfolioConfig.projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      console.error(`Project with ID ${projectId} not found.`);
      return false;
    }
    
    // Update project properties
    const project = window.portfolioConfig.projects[projectIndex];
    
    if (updates.title) project.title = updates.title;
    if (updates.description) project.description = updates.description;
    if (updates.modelPath) project.modelPath = updates.modelPath;
    if (updates.modelScale) project.modelScale = updates.modelScale;
    
    // Update the projectsData to maintain compatibility
    window.projectsData = [
      window.portfolioConfig.homepage,
      ...window.portfolioConfig.projects
    ];
    
    console.log(`Updated project with ID ${projectId}`);
    
    // If we're currently viewing this project, update the display
    const currentIndex = projectIndex + 1; // +1 because index 0 is homepage
    if (window.state && window.state.currentIndex === currentIndex) {
      const titleElement = document.getElementById('info-title');
      const descriptionElement = document.getElementById('info-description');
      
      if (titleElement && updates.title) {
        titleElement.textContent = updates.title;
      }
      
      if (descriptionElement && updates.description) {
        descriptionElement.textContent = updates.description;
      }
    }
    
    // Reload page to see changes if model path was updated
    if (updates.modelPath && updates.reload !== false) {
      location.reload();
    }
    
    return true;
  },
  
  /**
   * Remove a project from the portfolio
   * @param {number} projectId - ID of the project to remove
   * @returns {boolean} Success status
   */
  removeProject: function(projectId) {
    if (!window.portfolioConfig) {
      console.error("Portfolio config not found. Make sure config.js is loaded first.");
      return false;
    }
    
    // Find the project by ID
    const projectIndex = window.portfolioConfig.projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      console.error(`Project with ID ${projectId} not found.`);
      return false;
    }
    
    // Remove the project
    window.portfolioConfig.projects.splice(projectIndex, 1);
    
    // Update IDs to keep them sequential
    window.portfolioConfig.projects.forEach((project, index) => {
      project.id = index + 1;
    });
    
    // Update the projectsData to maintain compatibility
    window.projectsData = [
      window.portfolioConfig.homepage,
      ...window.portfolioConfig.projects
    ];
    
    console.log(`Removed project with ID ${projectId}`);
    
    // Reload page to see changes
    location.reload();
    
    return true;
  },
  
  /**
   * Get all projects
   * @returns {Array} Array of all projects
   */
  getAllProjects: function() {
    if (!window.portfolioConfig) {
      console.error("Portfolio config not found. Make sure config.js is loaded first.");
      return [];
    }
    
    return [...window.portfolioConfig.projects];
  },
  
  /**
   * Get a specific project by ID
   * @param {number} projectId - ID of the project to get
   * @returns {Object|null} The project or null if not found
   */
  getProject: function(projectId) {
    if (!window.portfolioConfig) {
      console.error("Portfolio config not found. Make sure config.js is loaded first.");
      return null;
    }
    
    return window.portfolioConfig.projects.find(p => p.id === projectId) || null;
  }
};

// Make the manager available globally
window.PortfolioManager = PortfolioManager;