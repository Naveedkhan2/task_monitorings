# Setup Commands - Task Monitoring System

## Step 1: Navigate to the Project Folder
```bash
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
```

## Step 2: Install Backend Dependencies
```bash
npm install
```

## Step 3: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

**OR Install Both at Once:**
```bash
npm install
cd client && npm install && cd ..
```

## Step 4: Start the Development Server

**Option A: Start Both Backend and Frontend Together**
```bash
npm run dev
```

**Option B: Start Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## Complete Setup (All Commands in Order)

```bash
# Navigate to project folder
cd "C:\Users\YAM-TECH\Documents\task monitoring system"

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Start both servers
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Login Credentials

**Admin:**
- Email: `admin@taskmonitor.com`
- Password: `admin123`

## Troubleshooting Commands

**If you get errors, try:**

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete node_modules and reinstall:
```bash
rmdir /s /q node_modules
rmdir /s /q client\node_modules
npm install
cd client && npm install && cd ..
```

3. Check Node.js version (should be 14+):
```bash
node --version
```

