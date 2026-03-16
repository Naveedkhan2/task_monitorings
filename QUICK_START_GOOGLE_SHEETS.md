# Quick Start - Google Sheets Database

## ✅ What's Done

I've converted your entire system to use **Google Sheets as the database**!

### All Operations Now Use Google Sheets:
- ✅ User Signup → Saves to "SignUp" sheet
- ✅ User Login → Reads from "SignUp" sheet
- ✅ Admin Assigns Task → Saves to "Task" sheet
- ✅ User Completes Task → Updates Status in "Task" sheet

---

## 📋 What You Need to Do (3 Steps)

### Step 1: Setup Apps Script (5 min)

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1AH6XcpXDwMbmOZmKI71MHCL7LbELaKivtGsSo9MVQWQ/edit

2. Go to **Extensions** → **Apps Script**

3. **Delete all existing code** and paste code from `google_apps_script.js`

4. Click **Save** (Ctrl+S)

5. Click **Deploy** → **New deployment** → **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - **Authorize** when prompted

6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### Step 2: Configure Flask App (1 min)

1. Create `.env` file:
   ```powershell
   copy config.env.example .env
   ```

2. Edit `.env` and paste your Web App URL:
   ```
   GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL/exec
   ```

### Step 3: Install & Run (1 min)

```powershell
pip install -r requirements.txt
python app.py
```

Then open: http://localhost:5000

---

## 🎯 How It Works

### User Signup Flow:
```
User signs up → Flask app → Google Sheets "SignUp" tab
- Auto-generates User ID
- Stores username, email, hashed password
```

### User Login Flow:
```
User logs in → Flask app → Google Sheets "SignUp" tab
- Finds user by email
- Verifies password (bcrypt)
- Returns user data
```

### Task Assignment Flow:
```
Admin assigns task → Flask app → Google Sheets "Task" tab
- User ID (Column A)
- Date (Column B) - today's date
- Task Description (Column C)
- Deadline (Column D)
- Status (Column E) - "Pending"
```

### Task Completion Flow:
```
User marks complete → Flask app → Google Sheets "Task" tab
- Finds task by User ID + Description
- Updates Status (Column E) to "Complete"
```

---

## 📊 Google Sheets Structure

### "SignUp" Sheet:
| User ID | User Name | Email | Password |
|---------|-----------|-------|----------|
| 1       | admin     | admin@taskmonitor.com | (hashed) |
| 2       | john      | john@example.com | (hashed) |

### "Task" Sheet:
| User ID | Date | Task Description | Deadline | Status |
|---------|------|------------------|----------|--------|
| 2       | 2024-01-15 | Complete report | 2024-01-20 | Pending |
| 2       | 2024-01-16 | Review code | 2024-01-18 | Complete |

---

## 🧪 Test Checklist

- [ ] Apps Script deployed
- [ ] Web App URL copied to `.env`
- [ ] Dependencies installed
- [ ] App running (`python app.py`)
- [ ] Test signup → Check "SignUp" sheet
- [ ] Test login → Should work
- [ ] Test task creation → Check "Task" sheet
- [ ] Test task completion → Status updates in sheet

---

## 🔧 Troubleshooting

**"Google Sheets not configured"**
- Check `.env` file exists
- Check `GOOGLE_SHEETS_WEB_APP_URL` is set correctly

**"Authorization required"**
- Re-deploy Apps Script
- Make sure access is set to "Anyone"

**Login not working**
- Check user exists in "SignUp" sheet
- Password is hashed (bcrypt)

**Tasks not appearing**
- Check Apps Script is deployed
- Check Web App URL is correct
- Check browser console for errors

---

## 📝 Notes

- Admin account is hardcoded: `admin@taskmonitor.com` / `admin123`
- All passwords are hashed with bcrypt before storing
- Task descriptions can be multi-line (title + description)
- Status values: "Pending", "In Progress", "Complete"

---

**That's it! Your entire database is now Google Sheets!** 🎉

