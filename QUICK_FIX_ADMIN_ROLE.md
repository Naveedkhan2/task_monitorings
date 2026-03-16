# Quick Fix: Set Admin Role in Google Sheets

## The Problem
The admin user's role is set to "user" instead of "admin" in Google Sheets, so the admin dashboard doesn't open.

## Solution: Manual Update in Google Sheets

### Step 1: Open Your Google Sheet
1. Go to your Google Sheet (the one connected to the Apps Script)
2. Make sure you're in the **"SignUp"** sheet/tab

### Step 2: Find the Admin User
1. Look for the row with email: **epsilonsystems25@gmail.com**
2. You should see columns: User ID | User Name | Email | Password | Role

### Step 3: Update the Role
1. In the **Role** column (Column E), change the value from `user` to `admin`
2. In the **User ID** column (Column A), make sure it's `230397` (if not, change it)

### Step 4: Save
- The changes save automatically in Google Sheets

### Step 5: Test
1. **Logout** from the application (if logged in)
2. **Login again** with:
   - Email: `epsilonsystems25@gmail.com`
   - Password: `R1s2h3h4`
3. You should now see the **Admin Dashboard**

---

## Alternative: Update Apps Script (If Manual Update Doesn't Work)

If the Role column doesn't exist or you can't update it:

### Step 1: Update Apps Script Code
1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. **Delete all existing code**
4. **Copy ALL code** from `google_apps_script.js` file
5. **Paste it** into the Apps Script editor
6. **Save** (Ctrl+S)

### Step 2: Deploy New Version
1. Click **Deploy → Manage deployments**
2. Click the **pencil icon** (Edit) on your existing deployment
3. Click **"New version"**
4. Click **"Deploy"**
5. **Copy the new Web App URL** if it changed

### Step 3: Update .env File (If URL Changed)
If you got a new Web App URL:
1. Open `.env` file
2. Update `GOOGLE_SHEETS_WEB_APP_URL` with the new URL
3. Save the file

### Step 4: Add Role Column (If Missing)
1. In your Google Sheet → SignUp sheet
2. If Column E doesn't have "Role" header:
   - Click on cell E1
   - Type: `Role`
   - Press Enter

### Step 5: Set Admin Role
1. Find the row with email: `epsilonsystems25@gmail.com`
2. In Column E (Role), type: `admin`
3. In Column A (User ID), make sure it's: `230397`

### Step 6: Restart Flask and Test
1. Restart your Flask app (Ctrl+C, then `python app.py`)
2. Logout and login again
3. You should see the admin dashboard

---

## Troubleshooting

### "Role column doesn't exist"
- Add it manually: Click on E1, type "Role", press Enter
- Or update the Apps Script (it will create it automatically for new sheets)

### "Can't edit the sheet"
- Make sure you have edit permissions on the Google Sheet
- Try refreshing the page

### "Still seeing user dashboard after update"
- Clear browser cache
- Logout completely
- Close and reopen the browser
- Login again

### "Apps Script not working"
- Make sure the Apps Script is deployed as a Web App
- Check that "Who has access" is set to "Anyone"
- Verify the Web App URL in `.env` file is correct

