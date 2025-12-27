# Links and Commands - Quick Reference

## 🔗 Important Links

### Local Application
```
http://localhost:5000
```

### Google Sheet (Watch Data in Real-Time)
```
https://docs.google.com/spreadsheets/d/1AH6XcpXDwMbmOZmKI71MHCL7LbELaKivtGsSo9MVQWQ/edit
```

### Apps Script Web App URL
```
https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec
```

---

## 📋 Commands

### Run the Application
```powershell
python app.py
```

### Install Dependencies (if needed)
```powershell
pip install -r requirements.txt
```

### Install Missing Packages
```powershell
pip install python-dotenv requests
```

---

## 🔐 Login Credentials

### Admin Account
```
Email: admin@taskmonitor.com
Password: admin123
```

### User Account
Create one using the Sign Up page

---

## ✅ Quick Test Steps

1. **Start the app:**
   ```powershell
   python app.py
   ```

2. **Open browser:**
   ```
   http://localhost:5000
   ```

3. **Open Google Sheet** (in another tab):
   ```
   https://docs.google.com/spreadsheets/d/1AH6XcpXDwMbmOZmKI71MHCL7LbELaKivtGsSo9MVQWQ/edit
   ```

4. **Test signup** → Watch "SignUp" tab in Google Sheet

5. **Test login** → Should redirect to dashboard

6. **Test task creation** → Watch "Task" tab in Google Sheet

7. **Test task completion** → Watch Status update in Google Sheet

---

## 🚀 Deploy to Vercel Commands

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Login to Vercel
```powershell
vercel login
```

### Set Environment Variable
```powershell
vercel env add GOOGLE_SHEETS_WEB_APP_URL
```
Paste: `https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec`

### Deploy
```powershell
vercel
```

### Deploy to Production
```powershell
vercel --prod
```

---

## 📝 Environment Variable (.env file)

```
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec
```

