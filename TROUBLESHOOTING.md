# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Python is not recognized"
**Problem:** Python is not installed or not in PATH

**Solution:**
- Download Python from: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"
- Restart your terminal/PowerShell after installation

**Verify:**
```powershell
python --version
```

---

### 2. "Module not found" errors
**Problem:** Dependencies not installed

**Solution:**
```powershell
pip install -r requirements.txt
```

If that doesn't work:
```powershell
python -m pip install -r requirements.txt
```

---

### 3. "Port 5000 already in use"
**Problem:** Another application is using port 5000

**Solution A - Change port:**
Edit `app.py` and change the last line:
```python
app.run(debug=True, port=5001)  # Change 5000 to 5001 or any other port
```
Then access at: `http://localhost:5001`

**Solution B - Kill process using port 5000:**
```powershell
netstat -ano | findstr :5000
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F
```

---

### 4. App starts but browser shows "Can't connect"
**Problem:** Firewall or network issue

**Solutions:**
- Make sure you're accessing: `http://localhost:5000` (not https)
- Check if Windows Firewall is blocking Python
- Try `http://127.0.0.1:5000` instead

---

### 5. Database errors
**Problem:** Database file permission issues

**Solution:**
- Delete `database.db` if it exists
- Restart the app (it will create a new database)

---

### 6. "No such file or directory: 'static'"
**Problem:** Running from wrong directory

**Solution:**
Make sure you're in the project folder:
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
python app.py
```

---

## Step-by-Step Debugging

### Step 1: Verify Python
```powershell
python --version
```
Should show: Python 3.x.x

### Step 2: Verify Location
```powershell
pwd
```
Should show: `C:\Users\YAM-TECH\Documents\task monitoring system`

### Step 3: Verify Files
```powershell
dir
```
Should show: `app.py`, `requirements.txt`, `static` folder

### Step 4: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 5: Run App
```powershell
python app.py
```

You should see:
```
Database initialized!
Starting server on http://localhost:5000
 * Running on http://127.0.0.1:5000
```

### Step 6: Open Browser
Go to: `http://localhost:5000`

---

## Quick Fix Commands

**If nothing works, try this complete reset:**

```powershell
# Navigate to project
cd "C:\Users\YAM-TECH\Documents\task monitoring system"

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Delete database (will recreate)
Remove-Item database.db -ErrorAction SilentlyContinue

# Run app
python app.py
```

---

## Still Not Working?

Please provide:
1. The exact error message you see
2. What command you ran
3. What happened (or didn't happen)

You can also run the test script:
```powershell
python test_run.py
```

