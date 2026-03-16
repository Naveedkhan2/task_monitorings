# PowerShell Commands (Windows)

## Important: Use `.\` prefix in PowerShell!

In PowerShell, you must use `.\` before batch file names.

## Installation Commands

### Option 1: Using Batch File
```powershell
.\install_python.bat
```

### Option 2: Manual Installation
```powershell
pip install -r requirements.txt
```

Or if pip doesn't work:
```powershell
python -m pip install -r requirements.txt
```

## Run the Application

### Option 1: Using Batch File
```powershell
.\run_python.bat
```

### Option 2: Manual Run
```powershell
python app.py
```

## Complete Setup (All Steps)

```powershell
# Step 1: Install dependencies
.\install_python.bat

# OR manually:
pip install -r requirements.txt

# Step 2: Run the application
.\run_python.bat

# OR manually:
python app.py
```

## Access the Application

After running, open your browser and go to:
```
http://localhost:5000
```

## Troubleshooting

**If Python is not found:**
```powershell
python --version
```
If this doesn't work, Python might not be in PATH. Install Python from https://www.python.org/downloads/

**If pip doesn't work:**
```powershell
python -m pip install -r requirements.txt
```

**If you get permission errors:**
Run PowerShell as Administrator, then try again.

