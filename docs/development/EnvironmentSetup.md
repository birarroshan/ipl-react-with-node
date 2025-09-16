# Environment Setup & Configuration

## 🛠️ Development Environment Setup

This guide covers the complete setup process for developing the IPL Play-Along application, from initial prerequisites to running the development server.

## 📋 Prerequisites

### Required Software
| Software | Version | Purpose | Installation |
|----------|---------|---------|-------------|
| **Node.js** | 18.x+ | JavaScript runtime | [Download](https://nodejs.org/) |
| **npm** | 8.x+ | Package manager | Included with Node.js |
| **Git** | Latest | Version control | [Download](https://git-scm.com/) |
| **SQL Server** | 2019+ | Database | [Download](https://www.microsoft.com/sql-server/) |

### Recommended Tools
| Tool | Purpose | Installation |
|------|---------|-------------|
| **VS Code** | Primary code editor | [Download](https://code.visualstudio.com/) |
| **SQL Server Management Studio** | Database management | [Download](https://docs.microsoft.com/sql/ssms/) |
| **Postman** | API testing | [Download](https://www.postman.com/) |
| **Azure Storage Explorer** | Cloud storage management | [Download](https://azure.microsoft.com/features/storage-explorer/) |

## 🔧 VS Code Configuration

### Required Extensions
Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-json",
    "ms-python.python",
    "ms-mssql.mssql",
    "ms-vscode.azure-account",
    "github.copilot",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Workspace Settings
Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.jsx": "javascriptreact"
  }
}
```

### Debug Configuration
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch React App",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["start"]
    },
    {
      "name": "Launch Express Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Attach to Express",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "."
    }
  ]
}
```

## 📦 Project Installation

### 1. Clone Repository
```bash
# Clone from GitHub
git clone https://github.com/birarroshan/ipl-react-with-node.git
cd ipl-react-with-node

# Check Node.js version
node --version  # Should be 18.x or higher
npm --version   # Should be 8.x or higher
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Install global development tools
npm install -g nodemon concurrently eslint prettier

# Verify installation
npm list --depth=0
```

### 3. Install Optional Global Tools
```bash
# Additional useful tools
npm install -g serve          # Static file server
npm install -g http-server    # Alternative static server
npm install -g json-server    # Mock API server
npm install -g @azure/static-web-apps-cli  # Azure SWA CLI
```

## 🌍 Environment Configuration

### Development Environment Variables

Create `.env.development`:
```bash
# ================================
# DEVELOPMENT ENVIRONMENT CONFIG
# ================================

# Application Settings
NODE_ENV=development
PORT=3000
DEBUG=true
REACT_APP_API_URL=http://localhost:5000/api

# Database Configuration (Local SQL Server)
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=DevPassword123!
DB_NAME=ipldev
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# Azure OpenAI (Development)
AZURE_OPENAI_ENDPOINT=https://myopenaieus.openai.azure.com/
AZURE_OPENAI_API_KEY=dev-openai-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=mychatbot

# Azure AD Authentication (Development)
REACT_APP_AZURE_CLIENT_ID=dev-client-id
REACT_APP_AZURE_TENANT_ID=dev-tenant-id
REACT_APP_AZURE_REDIRECT_URI=http://localhost:3000

# Push Notifications (Development VAPID Keys)
VAPID_PUBLIC_KEY=BGQnf5Xe5PXvLwVLjoQpeO6WKdTB9oYs2E-DQEstSaXXTD0RExIrP1YUA3W2fGf9Un0Re3Rx_SIhUdJ3uJudxS4
VAPID_PRIVATE_KEY=Nim6fzW67Og-2wGMC0EQ3gbyGAkf8HDpUh-5EtloXOo
VAPID_EMAIL=mailto:dev@iplplayalong.com

# Logging Configuration
LOG_LEVEL=debug
ENABLE_CONSOLE_LOGS=true
ENABLE_FILE_LOGS=true
LOG_FILE_PATH=./logs/development.log

# Development Features
REACT_APP_ENABLE_DEBUG_TOOLS=true
REACT_APP_SHOW_DEV_WARNINGS=true
ENABLE_HOT_RELOAD=true
```

### Local Environment Overrides

Create `.env.local` for personal settings:
```bash
# Personal developer overrides (not committed to git)
DB_PASSWORD=YourLocalPassword
AZURE_OPENAI_API_KEY=your-personal-dev-key
LOG_LEVEL=trace
```

### Environment Validation Script

Create `scripts/validate-env.js`:
```javascript
const requiredEnvVars = [
    'NODE_ENV',
    'DB_SERVER',
    'DB_USER', 
    'DB_PASSWORD',
    'DB_NAME',
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_API_KEY',
    'VAPID_PUBLIC_KEY',
    'VAPID_PRIVATE_KEY'
];

function validateEnvironment() {
    console.log('🔍 Validating environment variables...');
    
    const missing = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => console.error(`  - ${varName}`));
        process.exit(1);
    }
    
    console.log('✅ All required environment variables are set');
    
    // Validate specific formats
    if (process.env.AZURE_OPENAI_ENDPOINT && !process.env.AZURE_OPENAI_ENDPOINT.startsWith('https://')) {
        console.error('❌ AZURE_OPENAI_ENDPOINT must start with https://');
        process.exit(1);
    }
    
    console.log('✅ Environment validation passed');
}

validateEnvironment();
```

## 🗄️ Database Setup

### Local SQL Server Setup

#### 1. Install SQL Server Express
```bash
# Download SQL Server 2019 Express
# Enable SQL Server Authentication
# Create 'sa' user with strong password
```

#### 2. Database Creation Script
```sql
-- database-setup.sql
USE master;
GO

-- Create development database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ipldev')
CREATE DATABASE ipldev;
GO

USE ipldev;
GO

-- Create login for development
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'ipldev_user')
CREATE LOGIN ipldev_user WITH PASSWORD = 'DevPassword123!';
GO

-- Create user and grant permissions
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'ipldev_user')
CREATE USER ipldev_user FOR LOGIN ipldev_user;
GO

ALTER ROLE db_datareader ADD MEMBER ipldev_user;
ALTER ROLE db_datawriter ADD MEMBER ipldev_user;
ALTER ROLE db_ddladmin ADD MEMBER ipldev_user;
GO

PRINT 'Database setup completed successfully';
```

#### 3. Run Database Setup
```bash
# Execute setup script
sqlcmd -S localhost -U sa -P YourPassword -i database-setup.sql

# Or use SSMS to run the script manually
```

### Database Schema Initialization

Create `scripts/init-db.js`:
```javascript
const { sql, poolPromise } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('🔄 Initializing database schema...');
        
        const pool = await poolPromise;
        
        // Read and execute schema file
        const schemaSQL = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
        const statements = schemaSQL.split('GO').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await pool.request().query(statement);
            }
        }
        
        console.log('✅ Database schema initialized');
        
        // Insert seed data
        const seedSQL = fs.readFileSync(path.join(__dirname, '../sql/seed-data.sql'), 'utf8');
        const seedStatements = seedSQL.split('GO').filter(stmt => stmt.trim());
        
        for (const statement of seedStatements) {
            if (statement.trim()) {
                await pool.request().query(statement);
            }
        }
        
        console.log('✅ Seed data inserted');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };
```

## 🚀 Development Server Startup

### Package.json Scripts
Ensure these scripts are in `package.json`:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build", 
    "serve": "node server.js",
    "dev": "concurrently \"npm start\" \"npm run serve\"",
    "dev:debug": "concurrently \"npm start\" \"nodemon --inspect server.js\"",
    "validate-env": "node scripts/validate-env.js",
    "init-db": "node scripts/init-db.js",
    "setup": "npm run validate-env && npm run init-db",
    "lint": "eslint src/ --ext .js,.jsx",
    "lint:fix": "eslint src/ --ext .js,.jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,css,md}",
    "test": "react-scripts test",
    "test:coverage": "npm test -- --coverage"
  }
}
```

### Startup Commands

#### First Time Setup
```bash
# Complete setup process
npm run setup

# This runs:
# 1. Environment validation
# 2. Database initialization  
# 3. Dependency check
```

#### Daily Development
```bash
# Start both frontend and backend
npm run dev

# Start with debugging enabled
npm run dev:debug

# Start individually
npm start        # Frontend only
npm run serve    # Backend only
```

#### Development Server URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Debug Port**: http://localhost:9229 (when debugging enabled)

### Startup Health Checks

Create `scripts/health-check.js`:
```javascript
const http = require('http');
const { poolPromise } = require('../config/database');

async function checkHealth() {
    console.log('🏥 Running development health checks...');
    
    // Check database connection
    try {
        const pool = await poolPromise;
        await pool.request().query('SELECT 1');
        console.log('✅ Database connection: OK');
    } catch (error) {
        console.error('❌ Database connection: FAILED');
        console.error(error.message);
    }
    
    // Check backend server
    try {
        await new Promise((resolve, reject) => {
            const req = http.get('http://localhost:5000/api/health', (res) => {
                if (res.statusCode === 200) {
                    console.log('✅ Backend server: OK');
                    resolve();
                } else {
                    reject(new Error(`Status: ${res.statusCode}`));
                }
            });
            req.on('error', reject);
            req.setTimeout(5000, () => reject(new Error('Timeout')));
        });
    } catch (error) {
        console.error('❌ Backend server: FAILED');
        console.error(error.message);
    }
    
    // Check frontend server
    try {
        await new Promise((resolve, reject) => {
            const req = http.get('http://localhost:3000', (res) => {
                if (res.statusCode === 200) {
                    console.log('✅ Frontend server: OK');
                    resolve();
                } else {
                    reject(new Error(`Status: ${res.statusCode}`));
                }
            });
            req.on('error', reject);
            req.setTimeout(5000, () => reject(new Error('Timeout')));
        });
    } catch (error) {
        console.error('❌ Frontend server: FAILED');
        console.error(error.message);
    }
    
    console.log('🏥 Health check completed');
}

module.exports = { checkHealth };

// Run if called directly
if (require.main === module) {
    checkHealth();
}
```

### Environment-Specific Configurations

#### Development
- Hot reloading enabled
- Detailed error messages
- Debug logging
- Source maps enabled
- Development database

#### Staging  
- Production build
- Limited logging
- Staging database
- Performance monitoring

#### Production
- Optimized build
- Error tracking only
- Production database
- Full monitoring

---

> 📌 **Note:** Always run `npm run setup` before starting development to ensure all prerequisites are met and the environment is properly configured.