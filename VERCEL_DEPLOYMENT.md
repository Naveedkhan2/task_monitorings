# Vercel Deployment Guide

## ⚠️ Important Note

**Flask apps on Vercel require special setup.** Vercel is designed for serverless functions, not traditional Flask apps. 

### Option 1: Use Vercel Serverless Functions (Recommended)
Convert Flask routes to Vercel serverless functions.

### Option 2: Use Alternative Hosting (Easier)
Consider these alternatives that work better with Flask:
- **Render.com** (Free tier, easy Flask deployment)
- **Railway.app** (Free tier, simple deployment)
- **PythonAnywhere** (Free tier, Flask-friendly)
- **Heroku** (Paid, but reliable)

---

## If You Still Want Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Set Environment Variables
```bash
vercel env add GOOGLE_SHEETS_WEB_APP_URL
# Paste: https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec
```

### Step 4: Deploy
```bash
vercel
```

### Step 5: Production Deploy
```bash
vercel --prod
```

---

## Better Alternative: Render.com (Recommended)

### Why Render?
- ✅ Free tier available
- ✅ Native Flask support
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Environment variables easy to set

### Deploy to Render:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to: https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: task-monitoring-system
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `python app.py`
     - **Instance Type**: Free

4. **Set Environment Variable**
   - Go to "Environment" tab
   - Add variable:
     - Key: `GOOGLE_SHEETS_WEB_APP_URL`
     - Value: `https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Get your live URL!

---

## Update app.py for Production

For Vercel or Render, update the last lines of `app.py`:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

---

## Environment Variables Checklist

Make sure these are set in your hosting platform:

- ✅ `GOOGLE_SHEETS_WEB_APP_URL` = `https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec`

---

## Testing After Deployment

1. Visit your deployed URL
2. Test signup → Check Google Sheet
3. Test login → Should work
4. Test task creation → Check Google Sheet
5. Test task completion → Status updates in sheet

---

## Quick Deploy Commands (Render)

If using Render, add `render.yaml`:

```yaml
services:
  - type: web
    name: task-monitoring-system
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python app.py
    envVars:
      - key: GOOGLE_SHEETS_WEB_APP_URL
        value: https://script.google.com/macros/s/AKfycbwXiKI3es2EghNYi3QTmXC7lOiyv9tFNp2mZV9r6SfY9tyNrLgFWB9hjWsRflyiP2xT/exec
```

