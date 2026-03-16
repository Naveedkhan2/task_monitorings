# Admin User Setup Instructions

## ✅ What's Been Done

1. **Updated Google Apps Script** (`google_apps_script.js`):
   - Added `Role` column (Column E) to SignUp sheet
   - Updated signup to support role and custom user_id
   - Added `update_user` action to modify existing users
   - Updated login and get_user to read role from sheet

2. **Updated Flask App** (`app.py`):
   - Removed hardcoded admin credentials
   - All authentication now goes through Google Sheets

3. **Created Admin Setup Script** (`add_admin_user.py`)

## 📋 What You Need to Do

### Step 1: Update Google Apps Script

1. **Open your Google Sheet**
2. **Go to Extensions → Apps Script**
3. **Replace ALL the code** with the updated code from `google_apps_script.js`
4. **Click Save** (Ctrl+S)
5. **Deploy → Manage deployments**
6. **Click the pencil icon** (Edit) on your existing deployment
7. **Click "New version"**
8. **Click "Deploy"**

### Step 2: Add Admin User to Google Sheets

After updating the Apps Script, run:

```powershell
python add_admin_user.py
```

This will:
- Add/update the admin user: `epsilonsystems25@gmail.com`
- Set User ID to: `230397`
- Set Role to: `admin`
- Hash the password: `R1s2h3h4`

### Step 3: Verify in Google Sheets

1. Open your Google Sheet
2. Go to the "SignUp" sheet
3. Find the row with email: `epsilonsystems25@gmail.com`
4. Verify:
   - **User ID** = `230397`
   - **User Name** = `Epsilon Systems`
   - **Email** = `epsilonsystems25@gmail.com`
   - **Password** = (hashed password, starts with `scrypt:...`)
   - **Role** = `admin`

### Step 4: Test Login

1. Restart your Flask app:
   ```powershell
   python app.py
   ```

2. Go to http://localhost:5000
3. Login with:
   - **Email**: `epsilonsystems25@gmail.com`
   - **Password**: `R1s2h3h4`
4. You should be redirected to the admin dashboard

## 🔧 Manual Setup (If Script Fails)

If the script doesn't work, manually add the admin user:

1. **Open Google Sheet → SignUp sheet**
2. **Add a new row** (or find existing row for the email)
3. **Fill in:**
   - **User ID**: `230397`
   - **User Name**: `Epsilon Systems`
   - **Email**: `epsilonsystems25@gmail.com`
   - **Password**: (run `python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('R1s2h3h4'))"` to get the hash)
   - **Role**: `admin`

## ✅ Verification Checklist

- [ ] Google Apps Script updated with new code
- [ ] Apps Script deployment updated (new version)
- [ ] Admin user exists in Google Sheets
- [ ] User ID = 230397
- [ ] Role = admin
- [ ] Password is hashed (starts with `scrypt:` or `pbkdf2:`)
- [ ] Flask app restarted
- [ ] Can login with admin credentials
- [ ] Redirected to admin dashboard after login

## 🔒 Security Notes

- Admin credentials are now stored in Google Sheets (not hardcoded)
- Password is hashed using werkzeug's `generate_password_hash`
- Role is stored in the sheet and checked during login
- No hardcoded admin credentials in the code

## 📝 Important Notes

- **User ID 230397** is now reserved for the admin account
- The system will auto-generate IDs for new users (starting from max existing ID + 1)
- If you need to change admin credentials, update them in Google Sheets
- The Role column must exist in your SignUp sheet (it will be created automatically for new sheets)

