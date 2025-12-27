# Quick Start Guide

## Run the Application

### Method 1: Simple Command
```powershell
python app.py
```

### Method 2: Using Batch File
```powershell
.\run_python.bat
```

### Method 3: Step by Step
```powershell
# 1. Install dependencies (first time only)
pip install -r requirements.txt

# 2. Run the app
python app.py
```

---

## Access the Application

Once the app is running, open your browser and go to:

**Main Application:**
```
http://localhost:5000
```

**Alternative (if localhost doesn't work):**
```
http://127.0.0.1:5000
```

---

## What You Should See

1. **When app starts:**
   ```
   Database initialized!
   Starting server on http://localhost:5000
   * Running on http://127.0.0.1:5000
   ```

2. **In browser:**
   - Login page with blue and white theme
   - "Task Monitoring System" title

---

## Login

**Admin Account:**
- Email: `admin@taskmonitor.com`
- Password: `admin123`

---

## If It's Not Working

1. Check if you see the startup messages above
2. Make sure you're using `http://` not `https://`
3. Try `http://127.0.0.1:5000` instead
4. Check Windows Firewall settings
5. See `TROUBLESHOOTING.md` for more help

---

## Stop the Server

Press `Ctrl + C` in the terminal/PowerShell where the app is running.

