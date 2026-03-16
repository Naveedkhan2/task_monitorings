# Step-by-Step: Fix Admin Role Issue

## Current Status
✅ Google Sheets URL is working  
❌ Apps Script doesn't have `update_user` action yet  
❌ Admin role is set to "user" instead of "admin"

## Solution: Two Options

---

## OPTION 1: Quick Manual Fix (5 minutes) ⚡

### Step 1: Open Google Sheet
1. Open your Google Sheet in browser
2. Click on the **"SignUp"** tab/sheet at the bottom

### Step 2: Add Role Column (If Missing)
1. Look at the top row (Row 1) - these are headers
2. Check if Column E has "Role" written in it
3. **If Column E is empty:**
   - Click on cell **E1**
   - Type: `Role`
   - Press **Enter**

### Step 3: Find Admin User
1. Look for the row with email: **epsilonsystems25@gmail.com**
2. You'll see columns like:
   - Column A: User ID
   - Column B: User Name  
   - Column C: Email
   - Column D: Password
   - Column E: Role

### Step 4: Update Admin User
1. **In Column A (User ID):** Make sure it says `230397`
   - If not, click the cell and change it to `230397`
2. **In Column E (Role):** Change `user` to `admin`
   - Click on the cell in Column E for that row
   - Delete "user"
   - Type: `admin`
   - Press **Enter**

### Step 5: Test
1. Go back to your Flask app
2. **Logout** (click Logout button)
3. **Login again** with:
   - Email: `epsilonsystems25@gmail.com`
   - Password: `R1s2h3h4`
4. You should now see **Admin Dashboard**! ✅

---

## OPTION 2: Update Apps Script (10 minutes) 🔧

This will enable the `update_user` action for future use.

### Step 1: Open Apps Script Editor
1. In your Google Sheet, click **Extensions → Apps Script**
2. A new tab will open with the Apps Script editor

### Step 2: Replace Code
1. **Select ALL** the existing code (Ctrl+A)
2. **Delete it** (Delete key)
3. **Open** the file `google_apps_script.js` from your project folder
4. **Copy ALL** the code from that file (Ctrl+A, Ctrl+C)
5. **Paste** it into the Apps Script editor (Ctrl+V)

### Step 3: Save
1. Click **Save** button (💾 icon) or press **Ctrl+S**
2. Give it a name like "Task Monitoring System" if prompted

### Step 4: Deploy New Version
1. Click **Deploy → Manage deployments**
2. You'll see your existing deployment
3. Click the **pencil icon** (✏️) to edit
4. Click **"New version"** button
5. Click **"Deploy"** button
6. **Copy the Web App URL** if it shows a new one

### Step 5: Update .env (If URL Changed)
**Only if you got a new URL:**
1. Open `.env` file in your project
2. Find the line: `GOOGLE_SHEETS_WEB_APP_URL=...`
3. Replace the URL with the new one
4. Save the file

### Step 6: Fix Admin Role
Now run this command:
```powershell
python fix_admin_role.py
```

Or manually update in Google Sheets (same as Option 1, Step 4)

### Step 7: Test
1. Restart Flask app (Ctrl+C, then `python app.py`)
2. Logout and login again
3. You should see Admin Dashboard! ✅

---

## Which Option Should You Use?

- **Use Option 1** if you just want to fix it quickly right now
- **Use Option 2** if you want to update the Apps Script for future features

**Both will work!** Option 1 is faster if you just need to fix the admin role now.

---

## Still Having Issues?

### "I can't find the SignUp sheet"
- Check all tabs at the bottom of your Google Sheet
- The sheet might be named differently
- Look for a sheet with columns: User ID, User Name, Email, Password

### "Role column doesn't exist and I can't add it"
- Make sure you have edit permissions on the Google Sheet
- Try refreshing the page
- Or use Option 2 to update Apps Script (it will create the column automatically)

### "After updating, still seeing user dashboard"
1. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click "Clear data"
2. **Logout completely**
3. **Close browser and reopen**
4. **Login again**

### "Apps Script update failed"
- Make sure you copied ALL the code from `google_apps_script.js`
- Make sure you saved before deploying
- Try deploying again

---

## Verification

After fixing, you can verify by running:
```powershell
python -c "from dotenv import load_dotenv; import os; import requests; load_dotenv(); url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL'); r = requests.post(url, json={'action': 'get_user', 'email': 'epsilonsystems25@gmail.com'}, timeout=10); import json; print(json.dumps(r.json(), indent=2))"
```

You should see `"role": "admin"` in the response.

