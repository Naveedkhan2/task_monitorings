# Complete Setup Guide - Google Sheets Database

## Overview
The entire database is now Google Sheets! All user signups and tasks are stored in your Google Sheet.

## Step 1: Setup Apps Script (5 minutes)

### 1.1 Open Apps Script
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1AH6XcpXDwMbmOZmKI71MHCL7LbELaKivtGsSo9MVQWQ/edit
2. Click **Extensions** → **Apps Script**
3. Delete any existing code

### 1.2 Paste Apps Script Code
1. Open the file: `google_apps_script.js` in this project
2. **Copy the entire code**
3. **Paste it** into Apps Script editor
4. Click **Save** (💾 or Ctrl+S)

### 1.3 Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) → Select **Web app**
3. Configure:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** when prompted:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to Task Monitoring System (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** - looks like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
7. **Save this URL** - you'll need it next!

## Step 2: Configure Flask App (2 minutes)

### 2.1 Create Config File
1. Copy `config.env.example` to `.env`:
   ```powershell
   copy config.env.example .env
   ```

2. Open `.env` file and paste your Web App URL:
   ```
   GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL_HERE/exec
   ```

### 2.2 Install Dependencies
```powershell
pip install -r requirements.txt
```

## Step 3: Create Default Admin (Optional)

The admin account (`admin@taskmonitor.com` / `admin123`) is hardcoded in the Flask app. If you want to add it to Google Sheets:

1. In your Google Sheet, go to "SignUp" tab
2. Add manually:
   - User ID: 1
   - User Name: admin
   - Email: admin@taskmonitor.com
   - Password: (hashed password - the app will handle this for new signups)

## Step 4: Run the Application

```powershell
python app.py
```

Then open: http://localhost:5000

## Step 5: Test Everything

### Test Signup:
1. Go to signup page
2. Create a new user account
3. Check Google Sheet "SignUp" tab - new row should appear!

### Test Login:
1. Login with the account you just created
2. Should redirect to user dashboard

### Test Task Assignment:
1. Login as admin (admin@taskmonitor.com / admin123)
2. Create a task and assign it to a user
3. Check Google Sheet "Task" tab - new row should appear!

### Test Task Completion:
1. Login as user
2. Change task status to "Completed"
3. Check Google Sheet "Task" tab - Status column should update to "Complete"!

## How Data Flows

### User Signup:
```
User fills form → Flask app → Google Sheets "SignUp" tab
```

### User Login:
```
User enters credentials → Flask app → Google Sheets "SignUp" tab → Verify → Login
```

### Admin Assigns Task:
```
Admin creates task → Flask app → Google Sheets "Task" tab
- User ID: assigned user
- Date: today's date
- Task Description: task details
- Deadline: deadline date
- Status: "Pending"
```

### User Completes Task:
```
User marks complete → Flask app → Google Sheets "Task" tab → Update Status to "Complete"
```

## Google Sheets Structure

### SignUp Sheet:
- Column A: User ID (auto-generated)
- Column B: User Name
- Column C: Email
- Column D: Password (hashed)

### Task Sheet:
- Column A: User ID
- Column B: Date
- Column C: Task Description
- Column D: Deadline
- Column E: Status (Pending/Complete)

## Troubleshooting

### "Google Sheets not configured"
- Make sure `.env` file exists with `GOOGLE_SHEETS_WEB_APP_URL`
- Check the URL is correct

### "Authorization required"
- Re-deploy Apps Script
- Make sure "Who has access" is set to "Anyone"

### Tasks not appearing
- Check Apps Script is deployed correctly
- Check Web App URL is correct
- Check browser console for errors

### Login not working
- Check password is correct
- Check Google Sheet "SignUp" tab has the user
- Check Apps Script logs for errors

## That's It!

Your entire database is now in Google Sheets. All operations read from and write to Google Sheets!

