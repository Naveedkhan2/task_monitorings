# Google Apps Script Setup Instructions

## Step-by-Step Guide

### Step 1: Open Apps Script Editor

1. Open your Google Sheet: **"Task Monitoring System"**
2. Click **Extensions** → **Apps Script**
3. A new tab will open with the Apps Script editor

### Step 2: Paste the Code

1. In the Apps Script editor, you'll see a default function `myFunction()`
2. **Delete all existing code**
3. Open the file: `google_apps_script.js` in this project
4. **Copy the entire code** from that file
5. **Paste it** into the Apps Script editor
6. Click **Save** (💾 icon or Ctrl+S)
7. Name the project: "Task Monitoring System"

### Step 3: Configure (Optional)

The code is already configured with default values, but you can adjust:

**In the code, you'll see:**
```javascript
const SHEET_NAME = 'Task';  // Change if your sheet tab has different name
const HEADER_ROW = 1;        // Change if headers are in different row
```

**Column configuration (usually don't need to change):**
- Column A = User ID
- Column B = Date
- Column C = Task Description
- Column D = Deadline
- Column E = Status

### Step 4: Deploy as Web App

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description**: "Task Monitoring System Integration"
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (for testing/development)
     - Note: For production, you might want "Anyone with Google account"
5. Click **Deploy**
6. **Authorize access:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to Task Monitoring System (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
8. **Save this URL** - we'll need it for the Python code!

### Step 5: Test the Web App

You can test if it's working:

1. Copy the Web App URL
2. Paste it in your browser
3. You should see:
   ```json
   {
     "message": "Task Monitoring System - Apps Script Web App",
     "status": "running"
   }
   ```

If you see this, the Apps Script is working! ✅

### Step 6: Share the URL

Share the Web App URL with me, and I'll integrate it into the Python Flask app.

---

## Troubleshooting

### "Authorization required"
- Make sure you clicked "Authorize access" during deployment
- Try deploying again and authorize properly

### "Sheet not found"
- Check that your sheet tab is named "Task" (or update SHEET_NAME in code)
- Make sure the sheet exists in your Google Sheet

### "Permission denied"
- Make sure "Who has access" is set to "Anyone" or "Anyone with Google account"
- Re-deploy if you changed access settings

### Changes not taking effect
- After editing code, you need to create a **new deployment**
- Or click "Manage deployments" → Edit → "New version" → Deploy

---

## What Happens Next

Once you share the Web App URL:

1. I'll add the URL to the Python Flask app configuration
2. I'll modify task creation to call Apps Script
3. I'll modify task status updates to call Apps Script
4. When admin assigns task → saves to Google Sheets
5. When user completes task → updates Status in Google Sheets

---

## Security Note

- The Web App URL acts as an API key - keep it private
- For local testing, "Anyone" access is fine
- For production, consider "Anyone with Google account"
- Don't share the URL publicly

---

## Quick Checklist

- [ ] Opened Apps Script editor
- [ ] Pasted code from `google_apps_script.js`
- [ ] Saved the project
- [ ] Created new deployment
- [ ] Set to "Web app"
- [ ] Authorized access
- [ ] Copied Web App URL
- [ ] Tested URL in browser
- [ ] Shared URL with me

