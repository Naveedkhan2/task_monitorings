# Python Flask Alternative - Setup Guide

## Alternative Used: **Python Flask + HTML/JavaScript**

This version doesn't require Node.js! It uses:
- **Backend**: Python Flask (simple Python web framework)
- **Frontend**: Plain HTML, CSS, and JavaScript (no build tools needed)
- **Database**: SQLite (built-in with Python)

## Installation Steps

### 1. Install Python
Make sure Python 3.7+ is installed:
```bash
python --version
```

If not installed, download from: https://www.python.org/downloads/

### 2. Install Dependencies

**In PowerShell (Windows):**
```powershell
.\install_python.bat
```

**OR manually:**
```powershell
pip install -r requirements.txt
```

### 3. Run the Application

**In PowerShell (Windows):**
```powershell
.\run_python.bat
```

**OR manually:**
```powershell
python app.py
```

That's it! The server will start on `http://localhost:5000`

## Access the Application

Simply open your browser and go to:
```
http://localhost:5000
```

No separate frontend server needed - Flask serves everything!

## Default Login Credentials

**Admin:**
- Email: `admin@taskmonitor.com`
- Password: `admin123`

## Features

✅ No Node.js required
✅ No npm/npx needed
✅ No build process
✅ Single command to run
✅ Same features as Node.js version

## Troubleshooting

**If pip doesn't work:**
```bash
python -m pip install -r requirements.txt
```

**If port 5000 is busy:**
Edit `app.py` and change the port number in the last line:
```python
app.run(debug=True, port=5000)  # Change 5000 to another port
```

## File Structure

```
task-monitoring-system/
├── app.py              # Flask backend (all server code)
├── requirements.txt    # Python dependencies
├── database.db         # SQLite database (created automatically)
└── static/
    ├── index.html      # Frontend HTML
    ├── style.css       # Styles
    └── app.js          # JavaScript logic
```

## Advantages of This Approach

1. **Simpler Setup**: Just install Python and Flask
2. **No Build Tools**: Plain HTML/CSS/JS, no compilation needed
3. **Single Server**: Everything runs on one port
4. **Easier Debugging**: No complex build processes
5. **Faster Development**: Changes reflect immediately

