# 3D Portfolio Website

A professional 3D portfolio website showcasing Blender models with scroll animations and dynamic text.

## Features

- Interactive 3D model showcase
- Smooth scrolling transitions between projects
- Starry background that transitions as you scroll
- Responsive design for desktop and mobile
- Easy-to-configure content without coding

## How to Add Your Models

### Step 1: Prepare Your Models

1. In Blender, export your models in one of these formats:
   - GLB/GLTF (recommended for best compatibility)
   - FBX
   - OBJ (include MTL files for materials)
2. Make sure they have proper scaling
3. Place them in the `client/public/models/` folder

### Step 2: Configure Your Portfolio

There are two ways to configure your portfolio:

#### Option 1: Edit the Configuration File

Edit the `client/public/config.js` file to update homepage content and add projects.

#### Option 2: Use the Portfolio Manager (Easier)

Open the browser console and use the PortfolioManager functions to update content dynamically.

## Downloading and Hosting Your Portfolio

See the DOWNLOAD_INSTRUCTIONS.md file for detailed steps on:
- Downloading the project
- Hosting on GitHub Pages
- Hosting on Netlify
- Local testing with Node.js

### Important Notes for Deployment

- All paths in your configuration must be relative to the root folder
- Make sure all your 3D models are properly included in the models directory
- Test your portfolio thoroughly after deployment to ensure all models load correctly
