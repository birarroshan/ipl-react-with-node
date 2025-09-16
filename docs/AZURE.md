# Azure Integration Documentation

## Overview
The IPL Play-Along application leverages multiple Azure services for authentication, AI-powered chat, hosting, and data storage, providing a comprehensive cloud-native solution.

## Azure Services Used

### 1. Azure Active Directory (Azure AD)
**Purpose:** User authentication and authorization

#### Configuration
```javascript
// In src/auth.js
export const msalConfig = {
    auth: {
        clientId: "your-azure-ad-client-id",
        authority: "https://login.microsoftonline.com/your-tenant-id",
        redirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};
```

#### Integration Components
- **SignInButton.jsx**: Handles user sign-in
- **SignOutButton.jsx**: Handles user sign-out  
- **ProfileData.jsx**: Displays user profile information

#### Implementation Example
```jsx
// Sign-in functionality
import { useMsal } from '@azure/msal-react';

export const SignInButton = () => {
    const { instance } = useMsal();
    
    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch((error) => {
            console.error('Login failed:', error);
        });
    };

    return <Button onClick={handleLogin}>Sign In</Button>;
};
```

#### User Profile Access
```jsx
// Access user information
import { useAccount, useMsal } from '@azure/msal-react';

export const ProfileData = () => {
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    if (account) {
        return (
            <div>
                <h5>Welcome, {account.name}</h5>
                <p>Email: {account.username}</p>
                <p>ID: {account.localAccountId}</p>
            </div>
        );
    }

    return null;
};
```

### 2. Azure OpenAI Service
**Purpose:** AI-powered chat functionality for IPL information

#### Configuration
```javascript
// In src/chat.js
const endpoint = "https://myopenaieus.openai.azure.com/";
const azureApiKey = "your-azure-openai-api-key";
const deploymentName = "mychatbot";
const apiVersion = "2024-02-15-preview";
```

#### Chat Implementation
```javascript
export async function getChatCompletion(userMessage) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-key", azureApiKey);

    const requestBody = {
        model: deploymentName,
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant having information about IPL teams. Consider team short forms: GT as Gujarat Titans, DC as Delhi Capitals, LSG as Lucknow Super Giants."
            },
            {
                role: "user", 
                content: userMessage
            }
        ],
        max_tokens: 150,
        temperature: 0.7
    };

    try {
        const response = await fetch(`${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Azure OpenAI API error:', error);
        throw error;
    }
}
```

#### Chat UI Integration
```jsx
// In App.js
const [chatResponse, setChatResponse] = useState('');
const [isLoading, setIsLoading] = useState(false);

const handleChatQuery = async (question) => {
    setIsLoading(true);
    try {
        const response = await getChatCompletion(question);
        setChatResponse(response);
    } catch (error) {
        setChatResponse('Sorry, I couldn\'t process your request. Please try again.');
    } finally {
        setIsLoading(false);
    }
};

// UI Component
<div className="chat-interface">
    <input 
        type="text" 
        placeholder="Ask about IPL teams..."
        onKeyPress={(e) => {
            if (e.key === 'Enter') {
                handleChatQuery(e.target.value);
            }
        }}
    />
    {isLoading && <div>Loading...</div>}
    {chatResponse && <div className="chat-response">{chatResponse}</div>}
</div>
```

### 3. Azure SQL Database
**Purpose:** Primary data storage for matches, votes, and user scores

#### Connection Configuration
```javascript
// In app.js
const { Connection, TYPES } = require('tedious');

const config = {
    server: 'iplserver.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER || 'myadmin',
            password: process.env.DB_PASSWORD || 'A@12345678'
        }
    },
    options: {
        database: process.env.DB_NAME || 'backenddb_Copy',
        connectionTimeout: 30000,
        requestTimeout: 30000,
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    }
};
```

#### Connection Management
```javascript
let connection;

function initializeConnection() {
    connection = new Connection(config);
    
    connection.on('connect', (err) => {
        if (err) {
            console.error('Connection failed:', err);
            setTimeout(() => reconnectDb(1000), 5000);
        } else {
            console.log('Connected to Azure SQL Database');
        }
    });

    connection.on('end', (err) => {
        console.log('Connection ended, reinitializing...');
        setTimeout(() => reconnectDb(100), 1000);
    });

    connection.on('error', (err) => {
        console.error('Database connection error:', err);
        setTimeout(() => reconnectDb(1000), 5000);
    });
}

function reconnectDb(delay) {
    setTimeout(() => {
        initializeConnection();
        connection.connect();
    }, delay);
}
```

#### Parameterized Queries
```javascript
function executeQuery(query, parameters = []) {
    return new Promise((resolve, reject) => {
        const request = connection.request();
        
        // Add parameters to prevent SQL injection
        parameters.forEach(param => {
            request.addParameter(param.name, param.type, param.value);
        });

        const results = [];
        
        request.on('row', (columns) => {
            const row = {};
            columns.forEach(column => {
                row[column.metadata.colName] = column.value;
            });
            results.push(row);
        });

        request.on('requestCompleted', () => {
            resolve(results);
        });

        request.on('error', (error) => {
            reject(error);
        });

        connection.execSql(request);
    });
}
```

### 4. Azure App Service
**Purpose:** Web application hosting and deployment

#### Deployment Configuration
The application is configured for deployment to Azure App Service using GitHub Actions.

**Web.config for IIS:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="app.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="StaticContent">
          <action type="Rewrite" url="public/{R:0}"/>
        </rule>
        <rule name="DynamicContent">
          <match url="/api/*" />
          <action type="Rewrite" url="app.js"/>
        </rule>
        <rule name="ReactRoutes">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/build/index.html"/>
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

#### Environment Variables Configuration
Set the following in Azure App Service Configuration:

```bash
# Database Configuration
DB_SERVER=iplserver.database.windows.net
DB_USER=myadmin
DB_PASSWORD=A@12345678
DB_NAME=backenddb_Copy

# Azure OpenAI Configuration  
AZURE_OPENAI_ENDPOINT=https://myopenaieus.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=mychatbot

# Push Notification Configuration
VAPID_PUBLIC_KEY=BGQnf5Xe5PXvLwVLjoQpeO6WKdTB9oYs2E-DQEstSaXXTD0RExIrP1YUA3W2fGf9Un0Re3Rx_SIhUdJ3uJudxS4
VAPID_PRIVATE_KEY=Nim6fzW67Og-2wGMC0EQ3gbyGAkf8HDpUh-5EtloXOo

# Application Settings
NODE_ENV=production
PORT=80
WEBSITE_NODE_DEFAULT_VERSION=18.17.0
```

### 5. Microsoft Graph API Integration
**Purpose:** Access user profile and organizational data

#### Configuration
```javascript
// In src/graph.js
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

export class GraphService {
    constructor(msalInstance) {
        const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
            msalInstance, 
            {
                scopes: ['User.Read', 'Mail.Read']
            }
        );
        
        this.graphClient = Client.initWithMiddleware({ authProvider });
    }

    async getUserProfile() {
        try {
            const user = await this.graphClient.api('/me').get();
            return user;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }

    async getUserPhoto() {
        try {
            const photo = await this.graphClient.api('/me/photo/$value').get();
            return photo;
        } catch (error) {
            console.error('Error getting user photo:', error);
            return null;
        }
    }
}
```

## Azure Resource Management

### Resource Group Structure
```
IPL-PlayAlong-RG/
├── iplserver (SQL Server)
├── backenddb_Copy (SQL Database) 
├── dmoipl (App Service)
├── myopenaieus (OpenAI Service)
├── ipl-storage (Storage Account)
└── ipl-keyvault (Key Vault)
```

### ARM Template for Infrastructure
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "sqlServerName": {
            "type": "string",
            "defaultValue": "iplserver"
        },
        "databaseName": {
            "type": "string", 
            "defaultValue": "backenddb_Copy"
        },
        "appServiceName": {
            "type": "string",
            "defaultValue": "dmoipl"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Sql/servers",
            "apiVersion": "2021-11-01",
            "name": "[parameters('sqlServerName')]",
            "location": "[resourceGroup().location]",
            "properties": {
                "administratorLogin": "myadmin",
                "administratorLoginPassword": "[parameters('sqlAdminPassword')]"
            },
            "resources": [
                {
                    "type": "databases",
                    "apiVersion": "2021-11-01",
                    "name": "[parameters('databaseName')]",
                    "location": "[resourceGroup().location]",
                    "dependsOn": [
                        "[parameters('sqlServerName')]"
                    ],
                    "sku": {
                        "name": "Basic",
                        "tier": "Basic"
                    }
                }
            ]
        },
        {
            "type": "Microsoft.Web/sites",
            "apiVersion": "2021-03-01",
            "name": "[parameters('appServiceName')]",
            "location": "[resourceGroup().location]",
            "properties": {
                "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', 'ipl-app-service-plan')]",
                "httpsOnly": true,
                "siteConfig": {
                    "nodeVersion": "18.17.0",
                    "appSettings": [
                        {
                            "name": "WEBSITE_NODE_DEFAULT_VERSION",
                            "value": "18.17.0"
                        }
                    ]
                }
            }
        }
    ]
}
```

### Azure CLI Management Scripts

#### Deployment Script
```bash
#!/bin/bash

# Variables
RESOURCE_GROUP="IPL-PlayAlong-RG"
LOCATION="East US"
APP_NAME="dmoipl"

# Login to Azure
az login

# Create resource group
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Deploy ARM template
az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file infrastructure.json \
    --parameters sqlAdminPassword="A@12345678"

# Configure app settings
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
    DB_SERVER="iplserver.database.windows.net" \
    DB_USER="myadmin" \
    DB_PASSWORD="A@12345678" \
    DB_NAME="backenddb_Copy"

# Deploy application code
az webapp deployment source config \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --repo-url "https://github.com/birarroshan/ipl-react-with-node" \
    --branch "main" \
    --manual-integration
```

#### Database Management Script
```bash
#!/bin/bash

# Connect to Azure SQL Database
az sql db show-connection-string \
    --server iplserver \
    --name backenddb_Copy \
    --client sqlcmd

# Run database migrations
sqlcmd -S iplserver.database.windows.net -d backenddb_Copy -U myadmin -P "A@12345678" -i migrations/schema.sql

# Backup database
az sql db export \
    --resource-group IPL-PlayAlong-RG \
    --server iplserver \
    --name backenddb_Copy \
    --storage-uri "https://iplstorage.blob.core.windows.net/backups/backup.bacpac" \
    --storage-key "storage-account-key" \
    --admin-user myadmin \
    --admin-password "A@12345678"
```

## Security and Compliance

### Azure Security Features

#### Key Vault Integration
```javascript
// Store sensitive configuration in Azure Key Vault
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const vaultName = "ipl-keyvault";
const url = `https://${vaultName}.vault.azure.net`;

const client = new SecretClient(url, credential);

async function getSecret(secretName) {
    try {
        const secret = await client.getSecret(secretName);
        return secret.value;
    } catch (error) {
        console.error(`Error retrieving secret ${secretName}:`, error);
        throw error;
    }
}

// Usage
const dbPassword = await getSecret("db-password");
const openaiKey = await getSecret("openai-api-key");
```

#### Managed Identity Configuration
```bash
# Enable system-assigned managed identity
az webapp identity assign \
    --resource-group IPL-PlayAlong-RG \
    --name dmoipl

# Grant access to Key Vault
az keyvault set-policy \
    --name ipl-keyvault \
    --resource-group IPL-PlayAlong-RG \
    --object-id $(az webapp identity show --resource-group IPL-PlayAlong-RG --name dmoipl --query principalId -o tsv) \
    --secret-permissions get list
```

#### SQL Database Security
```sql
-- Enable Transparent Data Encryption
ALTER DATABASE backenddb_Copy SET ENCRYPTION ON;

-- Configure firewall rules
EXEC sp_set_firewall_rule 
    @name = N'AllowAzureServices', 
    @start_ip_address = '0.0.0.0', 
    @end_ip_address = '0.0.0.0';

-- Enable auditing
CREATE DATABASE AUDIT SPECIFICATION [IPL_Database_Audit]
FOR SERVER AUDIT [IPL_Server_Audit]
ADD (SELECT, INSERT, UPDATE, DELETE ON dbo.iplTest BY public),
ADD (INSERT, UPDATE ON dbo.matches BY public);
```

### Monitoring and Alerting

#### Application Insights Integration
```javascript
// In app.js
const appInsights = require('applicationinsights');

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true)
    .start();

// Custom telemetry
const client = appInsights.defaultClient;

app.post('/api/entries', (req, res) => {
    // Track custom event
    client.trackEvent({
        name: 'VoteSubmitted',
        properties: {
            team: req.body.team,
            player: req.body.name
        }
    });
    
    // Track custom metric
    client.trackMetric({
        name: 'TotalVotes',
        value: 1
    });
});
```

#### Azure Monitor Alerts
```bash
# Create alert rule for high CPU usage
az monitor metrics alert create \
    --name "High CPU Alert" \
    --resource-group IPL-PlayAlong-RG \
    --scopes "/subscriptions/{subscription-id}/resourceGroups/IPL-PlayAlong-RG/providers/Microsoft.Web/sites/dmoipl" \
    --condition "avg Percentage CPU > 80" \
    --description "Alert when CPU usage exceeds 80%" \
    --evaluation-frequency 5m \
    --window-size 15m \
    --severity 2

# Create alert rule for database connection failures
az monitor metrics alert create \
    --name "DB Connection Failures" \
    --resource-group IPL-PlayAlong-RG \
    --scopes "/subscriptions/{subscription-id}/resourceGroups/IPL-PlayAlong-RG/providers/Microsoft.Sql/servers/iplserver/databases/backenddb_Copy" \
    --condition "avg connection_failed > 5" \
    --description "Alert when database connection failures exceed 5 in 15 minutes" \
    --evaluation-frequency 5m \
    --window-size 15m \
    --severity 1
```

## Cost Optimization

### Resource Sizing Recommendations
```json
{
    "appService": {
        "tier": "Basic",
        "size": "B1",
        "instances": 1,
        "monthlyCost": "$13.14"
    },
    "sqlDatabase": {
        "tier": "Basic",
        "dtu": 5,
        "storage": "2GB",
        "monthlyCost": "$4.99"
    },
    "openAI": {
        "model": "gpt-3.5-turbo",
        "estimatedRequests": 1000,
        "monthlyCost": "$2.00"
    },
    "totalEstimatedCost": "$20.13"
}
```

### Cost Monitoring Script
```bash
#!/bin/bash

# Get cost analysis for resource group
az consumption usage list \
    --top 10 \
    --output table \
    --query "[?resourceGroup=='IPL-PlayAlong-RG'].{Resource:instanceName, Service:meterCategory, Cost:pretaxCost, Currency:currency}"

# Set budget alert
az consumption budget create \
    --resource-group IPL-PlayAlong-RG \
    --budget-name "IPL-Monthly-Budget" \
    --amount 50 \
    --time-grain Monthly \
    --start-date 2024-01-01 \
    --end-date 2024-12-31
```

## Disaster Recovery

### Backup Strategy
```bash
#!/bin/bash

# Database backup
az sql db export \
    --resource-group IPL-PlayAlong-RG \
    --server iplserver \
    --name backenddb_Copy \
    --storage-uri "https://iplbackup.blob.core.windows.net/backups/$(date +%Y%m%d).bacpac" \
    --storage-key "$STORAGE_KEY" \
    --admin-user myadmin \
    --admin-password "$DB_PASSWORD"

# App Service backup  
az webapp config backup create \
    --resource-group IPL-PlayAlong-RG \
    --webapp-name dmoipl \
    --backup-name "backup-$(date +%Y%m%d)" \
    --storage-account-url "https://iplbackup.blob.core.windows.net/app-backups" \
    --storage-account-key "$STORAGE_KEY"
```

### Recovery Procedures
```bash
#!/bin/bash

# Restore database from backup
az sql db import \
    --resource-group IPL-PlayAlong-RG \
    --server iplserver \
    --name backenddb_Copy_restored \
    --storage-uri "https://iplbackup.blob.core.windows.net/backups/20240315.bacpac" \
    --storage-key "$STORAGE_KEY" \
    --admin-user myadmin \
    --admin-password "$DB_PASSWORD"

# Restore app service
az webapp config backup restore \
    --resource-group IPL-PlayAlong-RG \
    --webapp-name dmoipl \
    --backup-name backup-20240315 \
    --storage-account-url "https://iplbackup.blob.core.windows.net/app-backups" \
    --storage-account-key "$STORAGE_KEY"
```

## Troubleshooting Azure Issues

### Common Azure AD Issues
```javascript
// Handle token expiration
import { InteractionRequiredAuthError } from '@azure/msal-browser';

const acquireTokenSilently = async () => {
    try {
        const response = await instance.acquireTokenSilent({
            scopes: ['User.Read'],
            account: accounts[0]
        });
        return response.accessToken;
    } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
            // Token expired, require user interaction
            return instance.acquireTokenPopup({
                scopes: ['User.Read']
            });
        }
        throw error;
    }
};
```

### Azure OpenAI Troubleshooting
```javascript
// Handle API rate limits and errors
const makeOpenAIRequest = async (prompt, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await getChatCompletion(prompt);
            return response;
        } catch (error) {
            if (error.status === 429) {
                // Rate limited, wait and retry
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                continue;
            } else if (error.status >= 500) {
                // Server error, retry
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            } else {
                // Client error, don't retry
                throw error;
            }
        }
    }
    throw new Error('Max retries exceeded');
};
```

### Database Connection Issues
```javascript
// Connection retry logic with exponential backoff
function connectWithRetry(maxRetries = 5) {
    let retries = 0;
    
    const connect = () => {
        connection = new Connection(config);
        
        connection.on('connect', (err) => {
            if (err) {
                retries++;
                if (retries < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, retries), 30000);
                    console.log(`Connection failed, retrying in ${delay}ms...`);
                    setTimeout(connect, delay);
                } else {
                    console.error('Max connection retries exceeded');
                }
            } else {
                console.log('Successfully connected to Azure SQL Database');
                retries = 0;
            }
        });
        
        connection.connect();
    };
    
    connect();
}
```

This comprehensive Azure integration documentation covers all the major Azure services used in the IPL Play-Along application, their configuration, deployment, security, monitoring, and troubleshooting procedures.