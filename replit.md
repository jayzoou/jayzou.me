# Jay Zou's Personal Website

## Overview
This is a personal website built with React, Vite, and MDX for content pages. It uses `vite-react-static` to generate static HTML files from React components and MDX content.

## Project Structure
- **src/**: Main application source code
  - **component/**: React components (Layout, NavBar, Posts, etc.)
  - **main.tsx**: Entry point that configures routes from MDX files
- **pages/**: MDX content files organized by topic (posts, projects, etc.)
- **dist/**: Build output (static HTML files)

## Tech Stack
- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **vite-react-static**: Static site generation
- **MDX**: Markdown with JSX for content
- **UnoCSS**: Utility-first CSS framework
- **Motion**: Animation library
- **React Router**: Client-side routing

## Development
- **Dev Server**: Runs on port 5000 at `0.0.0.0`
- **HMR**: Configured for Replit's proxy environment
- **Build**: Generates static files in `dist/` directory

## Deployment
- **Type**: Static site deployment
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

## Recent Changes (December 7, 2025)
- Configured Vite to run on port 5000 with 0.0.0.0 host for Replit compatibility
- Added HMR configuration for Replit's proxy environment
- Set up deployment configuration for static hosting
- Installed all npm dependencies
