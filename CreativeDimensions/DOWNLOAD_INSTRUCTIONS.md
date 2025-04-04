# Downloading and Hosting Your 3D Portfolio

This document provides step-by-step instructions on how to download and host your 3D portfolio website.

## Downloading the Project

1. Click the "Download ZIP" button at the top of the project page
2. Extract the ZIP file to your local computer

## Folder Structure

The downloaded project will have the following structure:

```
3d-portfolio/
├── client/
│   ├── public/
│   │   ├── models/         (Place your 3D models here)
│   │   ├── config.js       (Main configuration file)
│   │   └── portfolio-manager.js
│   ├── src/
│   │   ├── js/             (Main JavaScript code)
│   │   └── styles.css      (CSS styling)
│   └── index.html          (Main HTML file)
└── README.md
```

## Hosting Options

### Option 1: Static Web Hosting (Recommended)

This portfolio is designed to be easy to host on any static web hosting service:

#### GitHub Pages

1. Create a new GitHub repository
2. Upload the extracted files to your repository
3. Enable GitHub Pages in the repository settings (Settings > Pages)
4. Your portfolio will be available at `yourusername.github.io/repository-name`

#### Netlify

1. Create a Netlify account at [netlify.com](https://www.netlify.com)
2. Drag and drop the extracted folder to Netlify's upload area
3. Your portfolio will be instantly deployed with a custom URL
4. You can configure your own domain name in the Netlify settings

#### Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm i -g vercel`
3. Navigate to the project folder in your terminal/command prompt
4. Run: `vercel`
5. Follow the prompts to deploy your portfolio

### Option 2: Local HTTP Server

For testing locally before deployment:

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Open a terminal/command prompt in the extracted folder
3. Run one of these commands:
   - `npx serve` 
   - `npx http-server`
4. Visit `http://localhost:5000` (or the URL shown in your terminal) in your browser

## Important Notes for Deployment

- All paths in your configuration must be relative to the root folder
- Make sure all your 3D models are properly included in the `client/public/models/` directory
- Test your portfolio thoroughly after deployment to ensure all models load correctly

## Customizing Your Portfolio

1. Edit `client/public/config.js` to update homepage text and add your projects
2. Place your 3D models in the `client/public/models/` folder
3. Update project entries to reference your model files
4. Refresh the page to see your changes

## Troubleshooting

If your 3D models don't load after deployment:

1. Check the browser console for errors (F12 > Console)
2. Verify that your model paths are correct in `config.js`
3. Confirm that your models are properly exported from Blender (GLB format recommended)
4. Make sure your web host allows serving .glb, .gltf, .obj, and .fbx files