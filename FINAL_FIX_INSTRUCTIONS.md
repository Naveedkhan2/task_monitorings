# Final Fix: Admin Role Not Working

## Current Status
✅ Google Sheets has role set to "admin" correctly  
✅ Direct API test shows role as "admin"  
❌ Flask login is receiving role as "user"  

## The Problem
The Apps Script in Google Sheets might not be updated with the latest code that reads the Role column correctly.

## Solution: Update Apps Script in Google Sheets

### Step 1: Open Apps Script Editor
1. Open your Google Sheet
2. Click **Extensions → Apps Script**
3. A new tab opens with the Apps Script editor

### Step 2: Replace ALL Code
1. **Select ALL** existing code (Ctrl+A)
2. **Delete it** (Delete key)
3. **Open** the file `google_apps_script.js` from your project folder
4. **Copy ALL** the code (Ctrl+A, then Ctrl+C)
5. **Paste** it into the Apps Script editor (Ctrl+V)
6. **Save** (Ctrl+S or click Save button)

### Step 3: Deploy New Version
1. Click **Deploy → Manage deployments**
2. You'll see your existing deployment
3. Click the **pencil icon** (✏️ Edit)
4. Click **"New version"** button
5. Click **"Deploy"** button
6. **IMPORTANT:** If a new URL appears, copy it
7. If you got a new URL, update your `.env` file:
   - Open `.env` file
   - Update `GOOGLE_SHEETS_WEB_APP_URL` with the new URL
   - Save

### Step 4: Restart Flask
1. Stop Flask (Ctrl+C)
2. Start again: `python app.py`

### Step 5: Clear Browser Cache
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Click "Clear site data"
4. Or run in Console: `localStorage.clear(); location.reload();`

### Step 6: Test Login
1. Go to http://localhost:5000
2. Login with:
   - Email: `epsilonsystems25@gmail.com`
   - Password: `R1s2h3h4`
3. Check Flask terminal - you should see:
   ```
   [Login Debug] ========== USER DATA FROM GOOGLE SHEETS ==========
   [Login Debug] user_data.get('role'): 'admin'
   [Login Debug] Cleaned role: 'admin'
   [Login] User epsilonsystems25@gmail.com logged in with role: 'admin'
   ```
4. You should be redirected to **Admin Dashboard**

## Verification

After updating, test the API directly:
```powershell
python test_role_reading.py
```

This should show role as 'admin'.

## If Still Not Working

Check the Flask terminal output when you login. The debug logs will show exactly what's being received from Google Sheets. Share the output if the role is still showing as 'user'.

