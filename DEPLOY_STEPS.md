# Deployment Steps - Quick Guide

## ✅ Already Done:
- ✅ Apps Script deployed
- ✅ Web App URL: https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec
- ✅ .env file created with URL
- ✅ Vercel config files created

---

## Next Steps to Deploy on Vercel:

### Step 1: Install Vercel CLI
Open PowerShell/Command Prompt and run:
```powershell
npm install -g vercel
```

If you don't have Node.js, download from: https://nodejs.org/

### Step 2: Login to Vercel
```powershell
vercel login
```
This will open your browser to login with GitHub/Google/Email.

### Step 3: Go to Your Project Folder
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
```

### Step 4: Set Environment Variable in Vercel
```powershell
vercel env add GOOGLE_SHEETS_WEB_APP_URL
```
When prompted, paste:
```
https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec
```

### Step 5: Deploy to Vercel
```powershell
vercel
```

Answer the questions:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? (press Enter for default or type a name)
- Directory? (press Enter for current directory)

### Step 6: Deploy to Production
```powershell
vercel --prod
```

This will give you a production URL like: `https://your-app-name.vercel.app`

---

## Alternative: Deploy via Vercel Dashboard (Easier!)

### Option A: Deploy from Vercel Website

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub/Google
3. **Click "Add New Project"**
4. **Import Git Repository** (if you have one on GitHub)
   - OR
   - **Upload Project** (drag and drop your project folder)

5. **Configure Project:**
   - Framework Preset: **Other**
   - Build Command: (leave empty or `pip install -r requirements.txt`)
   - Output Directory: (leave empty)
   - Install Command: `pip install -r requirements.txt`

6. **Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - Key: `GOOGLE_SHEETS_WEB_APP_URL`
     - Value: `https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec`

7. **Click "Deploy"**

---

## ⚠️ Important: Vercel Limitation

**Note:** Vercel works best with serverless functions. For Flask apps, you might encounter issues. 

### Better Alternative: Render.com (Easier for Flask)

If Vercel gives you trouble, use Render.com instead:

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click "New" → "Web Service"**
4. **Connect your GitHub repository** (or use Render CLI)
5. **Settings:**
   - Name: `task-monitoring-system`
   - Environment: **Python 3**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
6. **Add Environment Variable:**
   - `GOOGLE_SHEETS_WEB_APP_URL` = `https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec`
7. **Click "Create Web Service"**

---

## Quick Test (Local First)

Before deploying, test locally:

```powershell
# Make sure .env file exists with your URL
# Then run:
python app.py
```

Visit: http://localhost:5000

If it works locally, it should work when deployed!

---

## What Happens After Deployment?

1. You'll get a live URL (like `https://your-app.vercel.app`)
2. Users can signup → Data saves to Google Sheets
3. Users can login → Reads from Google Sheets
4. Admin can assign tasks → Saves to Google Sheets
5. Users can complete tasks → Updates Google Sheets

---

## Need Help?

- **Vercel Issues?** → Try Render.com (easier for Flask)
- **Environment Variables?** → Make sure they're set in Vercel dashboard
- **Deployment Failed?** → Check build logs in Vercel dashboard

