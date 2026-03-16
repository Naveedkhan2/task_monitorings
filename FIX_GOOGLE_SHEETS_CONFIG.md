# Fix: Google Sheets Not Configured Error

## Problem
You're seeing the error: **"Google Sheets not configured"** because the `GOOGLE_SHEETS_WEB_APP_URL` environment variable is not set.

## Quick Fix (3 Steps)

### Step 1: Get Your Google Apps Script Web App URL

1. **Open your Google Sheet** (or create one named "Task Monitoring System")
2. **Go to Extensions** → **Apps Script**
3. **Paste the code** from `google_apps_script.js` into the Apps Script editor
4. **Click Save** (Ctrl+S)
5. **Click Deploy** → **New deployment**
6. **Select "Web app"** (click the gear icon if needed)
7. **Configure:**
   - Execute as: **Me**
   - Who has access: **Anyone** (for testing)
8. **Click Deploy**
9. **Authorize** when prompted
10. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### Step 2: Create .env File

**Option A: Using PowerShell (Recommended)**
```powershell
# Copy the example file
Copy-Item config.env.example .env

# Edit .env file and add your URL
notepad .env
```

**Option B: Manual Creation**
1. Create a new file named `.env` in the project root
2. Add this line (replace with your actual URL):
```
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL_HERE/exec
```

### Step 3: Restart the Flask App

1. **Stop the current server** (Ctrl+C in the terminal)
2. **Start it again:**
   ```powershell
   python app.py
   ```

The error should now be gone! ✅

---

## Verify It's Working

1. The warning message should disappear from the signup page
2. Try signing up - it should work without errors
3. Check your Google Sheet - you should see the new user in the "SignUp" sheet

---

## Troubleshooting

### "Still seeing the error after setting .env"
- Make sure the `.env` file is in the **root directory** (same folder as `app.py`)
- Make sure there are **no spaces** around the `=` sign
- Make sure the URL is **complete** and includes `/exec` at the end
- **Restart** the Flask app after creating/editing `.env`

### "Can't find Apps Script editor"
- Make sure you're in a Google Sheet (not Google Docs)
- Click **Extensions** → **Apps Script** (not Tools)

### "Authorization error"
- Make sure you clicked "Authorize access" during deployment
- Make sure "Who has access" is set to "Anyone" (for testing)

### "Web App URL not working"
- Test the URL in your browser - you should see a JSON response
- Make sure the Apps Script is deployed (not just saved)
- Try creating a new deployment if the old one doesn't work

---

## Need Help?

See the detailed setup guide: `APPS_SCRIPT_SETUP.md`

