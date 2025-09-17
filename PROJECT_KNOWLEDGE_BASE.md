# IPL Play-Along Project Knowledge Base

This file provides a comprehensive map of all project files with brief descriptions for AI agent knowledge base integration. This enables accurate file search and context understanding for development assistance.

## 📁 Project Structure & File Descriptions

### 🔧 Root Configuration Files

**📄 `package.json`**
Project configuration with dependencies including React 18.2.0, Express 4.18.2, Azure MSAL, OpenAI, SQL Server integration, web-push notifications, and security middleware. Defines build, start, and test scripts.

**📄 `app.js`** (571 lines)
Main Express.js server application with Azure SQL database connections, OpenAI chat integration, push notification system, authentication middleware, and API endpoints for voting, chat, leaderboard, and notification subscriptions.

**📄 `server.js`**
Simple server entry point that imports and starts the main Express app from app.js. Used for production deployment and server initialization.

**📄 `web.config`**
IIS web server configuration for Azure App Service deployment with Node.js runtime settings and static file handling rules.

**📄 `.gitignore`**
Git ignore patterns for node_modules, build files, environment variables, and IDE-specific files to prevent sensitive data commits.

**📄 `package-lock.json`**
NPM lockfile with exact dependency versions and integrity hashes for consistent installations across environments.

**📄 `README.md`**
Project overview and basic setup instructions for the IPL Play-Along voting application with Azure integration details.

**📄 `LICENSE`**
MIT License file defining usage rights and restrictions for the open-source IPL Play-Along application.

### 🌐 API & Server Components

**📄 `api/index.js`**
Vercel serverless function wrapper that exports the main Express app for serverless deployment on Vercel platform.

**📄 `server/cronjob.js`**
Scheduled task implementation using node-cron for automated database cleanup, match status updates, and periodic notification sending.

### 🎨 React Frontend (src/)

**📄 `src/App.js`** (359 lines)
Main React application component with Azure MSAL authentication, voting form logic, real-time chat interface, animated GIF displays, push notification subscription, and leaderboard integration.

**📄 `src/index.js`**
React app entry point with MSAL Provider configuration, service worker registration for push notifications, and root component rendering setup.

**📄 `src/auth.js`**
Azure MSAL configuration with client ID, tenant authority, cache settings, and authentication scopes for Microsoft identity platform integration.

**📄 `src/chat.js`**
Chat component implementation with Azure OpenAI integration, message history display, real-time messaging, and conversation persistence functionality.

**📄 `src/graph.js`**
Microsoft Graph API integration for user profile data retrieval, including display name, email, and additional user attributes from Azure AD.

### 🔧 React Components (src/components/)

**📄 `src/components/EntryForm.js`**
Voting form component with team selection dropdown, name input (hidden), form validation, submit button logic, and dynamic points calculation display.

**📄 `src/components/EntryForm.lazy.js`**
Lazy-loaded wrapper for EntryForm component using React.lazy() for code splitting and performance optimization.

**📄 `src/components/EntryForm.module.css`**
CSS modules styling for EntryForm component with responsive design, button states, dropdown styling, and form layout definitions.

**📄 `src/components/EntryForm.stories.js`**
Storybook stories for EntryForm component with different states, props combinations, and interactive testing scenarios.

**📄 `src/components/Login.js`**
Authentication component with Azure MSAL sign-in/sign-out buttons, user profile display, authentication state management, and error handling.

**📄 `src/components/NotificationComponent.js`**
Push notification management component with subscription handling, permission requests, service worker communication, and notification display logic.

**📄 `src/components/PageLayout.jsx`**
Main layout component with navigation header, Bootstrap integration, responsive design, user authentication status display, and consistent page structure.

**📄 `src/components/PageLayout.module.css`**
CSS modules for PageLayout with header styling, navigation elements, responsive breakpoints, and consistent spacing definitions.

**📄 `src/components/ProfileData.jsx`**
User profile display component showing Microsoft Graph data including display name, email, profile picture, and additional user attributes.

**📄 `src/components/SignInButton.jsx`**
Dedicated sign-in button component with Azure MSAL integration, loading states, error handling, and custom styling options.

**📄 `src/components/SignOutButton.jsx`**
Sign-out button component with confirmation dialog, session cleanup, cache clearing, and redirect handling after logout.

### 🎯 Static Assets & Media

**📁 `src/gifs/`**
Collection of 8 animated IPL team GIFs (ipl1.gif through ipl8.gif) used for dynamic visual displays during matches and voting phases.

**📄 `src/guide.png`**
User guide image showing application features, voting process, and scoring system explanation.

**📄 `src/ipl2020.jfif`**
IPL tournament logo image used in application branding and header display.

**📄 `src/logo.svg`**
React application logo in SVG format for scalable branding elements.

**📄 `src/noticon.jpg`**
Notification icon image used for push notification display and browser notification system.

**📄 `src/notiimage.png` / `src/notiimage.webp`**
Notification images in PNG and WebP formats for cross-browser compatibility in push notification system.

### 🎨 Styling & CSS

**📄 `src/App.css`**
Main application CSS with global styles, component layouts, responsive design rules, animation definitions, and Bootstrap customizations.

**📄 `src/index.css`**
Global CSS reset, base typography, color variables, responsive utilities, and foundational styling for the entire application.

### 🔧 Service Workers & PWA

**📄 `src/service-worker.js`**
Custom service worker for push notification handling, cache management, offline functionality, and background sync capabilities.

**📄 `src/serviceWorker.js`**
Service worker registration and management utilities with update detection, cache strategies, and notification permission handling.

**📄 `src/setupTests.js`**
Jest testing configuration with test utilities, mock implementations, and global test setup for React component testing.

### 🌐 Public Assets (public/)

**📄 `public/index.html`**
Main HTML template with meta tags, PWA configuration, service worker registration script, and React app mounting point.

**📄 `public/manifest.json`**
Progressive Web App manifest with app metadata, icons, theme colors, display modes, and installation configuration.

**📄 `public/favicon.ico`**
Browser favicon icon in ICO format for tab display and bookmark identification.

**📄 `public/logo192.png` / `public/logo512.png`**
PWA icons in 192x192 and 512x512 pixel sizes for home screen installation and app launcher display.

**📄 `public/robots.txt`**
Search engine crawler instructions for SEO optimization and content indexing guidelines.

## 🔍 Key File Relationships

### Authentication Flow
- `src/auth.js` → `src/App.js` → `src/components/Login.js` → `src/components/SignInButton.jsx`

### Voting System
- `src/App.js` → `src/components/EntryForm.js` → `app.js` (API endpoints)

### Chat System
- `src/chat.js` → `app.js` (OpenAI integration) → Azure OpenAI service

### Notification System
- `src/components/NotificationComponent.js` → `src/service-worker.js` → `app.js` (web-push)

### Database Integration
- `app.js` → Azure SQL Database (matches, votes, leaderboard, subscriptions)

## 🎯 Primary Technologies

**Frontend:** React 18.2.0, Bootstrap 5.3.3, Azure MSAL, CSS Modules
**Backend:** Express.js 4.18.2, Node.js, Azure SQL, web-push
**Cloud:** Azure App Service, Azure AD, Azure OpenAI, Azure SQL Database
**Security:** Helmet.js, CORS, CSP headers, express-session
**Deployment:** Vercel serverless functions, Azure App Service

## 📊 File Statistics

- **Total Files:** 47 source files (excluding docs, build, node_modules)
- **Main Application:** `app.js` (571 lines) + `src/App.js` (359 lines)
- **Components:** 8 React components with modular CSS
- **Configuration:** 6 configuration files
- **Assets:** 14 media/image files
- **API Integration:** Azure services, OpenAI, SQL Server

This knowledge base enables AI agents to quickly identify relevant files for:
- Authentication issues → `src/auth.js`, `src/components/Login.js`
- Database problems → `app.js` (SQL connections and queries)
- Frontend bugs → `src/App.js`, `src/components/` folder
- Deployment issues → `web.config`, `package.json`, `api/index.js`
- Notification problems → `src/service-worker.js`, `src/components/NotificationComponent.js`
- Styling issues → `src/App.css`, `src/index.css`, component CSS modules