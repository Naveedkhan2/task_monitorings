# Commands to Run Task Monitoring System

## Quick Start (Easiest Method)

### Option 1: Using Batch File (Recommended)
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
.\start_backend.bat
```

### Option 2: Using Python Directly
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
python app.py
```

---

## Complete Setup (First Time Only)

### Step 1: Navigate to Project Folder
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
```

### Step 2: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

**OR use batch file:**
```powershell
.\install_python.bat
```

### Step 3: Check/Setup Environment Variables
Make sure you have a `.env` file with:
```
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec
```

### Step 4: Start the Server
```powershell
python app.py
```

**OR use batch file:**
```powershell
.\start_backend.bat
```

---

## Daily Usage Commands

### Start Backend Server:
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
python app.py
```

### Access the Application:
- **URL**: `http://localhost:5000`
- Open in your browser

---

## All Available Commands

### Python/Backend Commands:
```powershell
# Install dependencies
pip install -r requirements.txt

# OR
.\install_python.bat

# Run server
python app.py

# OR
.\start_backend.bat
.\run_python.bat
```

### Frontend Commands (If using React separately):
```powershell
# Navigate to client folder
cd client

# Install frontend dependencies
npm install

# Start frontend dev server
npm run dev

# Frontend will run on http://localhost:3000
```

### Node.js/Full Stack Commands (Alternative):
```powershell
# Install all dependencies (backend + frontend)
npm run install-all

# Start both servers together
npm run dev

# OR separately:
npm run server  # Backend only
npm run client  # Frontend only
```

---

## URLs

### Local Application:
- **Python Flask**: `http://localhost:5000`
- **React Frontend**: `http://localhost:3000` (if running separately)

### Login Credentials:
- **Admin Email**: `admin@taskmonitor.com`
- **Admin Password**: `admin123`

---

## Troubleshooting Commands

### Check Python Version:
```powershell
python --version
```

### Check if Python packages are installed:
```powershell
python -c "import flask"
python -c "import flask_cors"
```

### Check Node.js Version (if needed):
```powershell
node --version
```

### Reinstall Dependencies:
```powershell
pip install -r requirements.txt --upgrade
```

### Check if Port 5000 is in use:
```powershell
netstat -ano | findstr :5000
```

### Clear Python Cache:
```powershell
Remove-Item -Recurse -Force __pycache__
```

---

## Stop the Server

Press `Ctrl + C` in the terminal where the server is running

---

## Full Command Sequence (Copy & Paste)

```powershell
# Navigate to project
cd "C:\Users\YAM-TECH\Documents\task monitoring system"

# Install dependencies (first time only)
pip install -r requirements.txt

# Start server
python app.py
```

Then open browser: `http://localhost:5000`

---

## Environment Setup

### Create .env file (if not exists):
```powershell
# Create .env file with:
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL/exec
```

### Check if .env exists:
```powershell
Test-Path .env
```

---

## Quick Reference Card

| Action | Command |
|--------|---------|
| **Start Server** | `python app.py` |
| **Install Dependencies** | `pip install -r requirements.txt` |
| **Using Batch File** | `.\start_backend.bat` |
| **Access URL** | `http://localhost:5000` |
| **Stop Server** | `Ctrl + C` |
| **Check Python** | `python --version` |

---

## Notes:

1. **Python Flask Server** runs on port **5000** by default
2. **No separate frontend server needed** - Flask serves the static files
3. **Admin approval system** is active - new signups need approval
4. **Google Sheets integration** required - make sure `.env` is configured

