# How to See the Changes in Admin Dashboard

## Steps to See the Changes:

### 1. **Restart the Development Server**

**Stop the current server** (if running):
- Press `Ctrl+C` in the terminal where the server is running

**Start the server again:**
```powershell
cd "C:\Users\YAM-TECH\Documents\task monitoring system"
npm run dev
```

### 2. **Clear Browser Cache and Hard Refresh**

**In your browser:**
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) for hard refresh
- OR Press `F12` to open DevTools, then right-click the refresh button and select "Empty Cache and Hard Reload"

### 3. **Reinitialize the Database** (Important!)

The new `task_assignments` table needs to be created. You have two options:

**Option A: Delete and recreate database (will lose existing data):**
```powershell
# Stop the server first (Ctrl+C)
# Then delete the database file:
Remove-Item "server\database\database.sqlite" -ErrorAction SilentlyContinue
# Start server again - it will recreate the database with the new table
npm run dev
```

**Option B: Manually add the table (keeps existing data):**
The table should be created automatically when the server starts, but if it doesn't exist, the server will create it.

### 4. **What You Should See:**

✅ **Date Range Filter:**
- Two date input fields next to the "Create New Task" button
- "Clear Filter" button when dates are selected

✅ **Multi-Select for Users:**
- When creating a task, the "Assign To" field is now a multi-select dropdown
- You can hold Ctrl (Windows) or Cmd (Mac) to select multiple users
- Shows instruction text: "Hold Ctrl (Windows) or Cmd (Mac) to select multiple users"

✅ **Status Display (Read-Only for Admin):**
- Tasks show a colored status badge instead of a dropdown
- Green = Completed
- Blue = In Progress  
- Orange = Pending
- Admin CANNOT change the status (only view it)

✅ **Multiple Users Display:**
- Tasks show all assigned users separated by commas
- Example: "Assigned to: User1, User2, User3"

## Troubleshooting:

### If you still don't see changes:

1. **Check Browser Console for Errors:**
   - Press `F12` in browser
   - Go to "Console" tab
   - Look for any red error messages

2. **Check Server Console:**
   - Look at the terminal where `npm run dev` is running
   - Check for any error messages

3. **Verify Files Were Saved:**
   - Make sure all file changes were saved
   - Check `client/src/pages/AdminDashboard.jsx` has the new code

4. **Try a Different Browser:**
   - Sometimes browser cache is stubborn
   - Try opening in an incognito/private window

5. **Restart Everything:**
   ```powershell
   # Stop server (Ctrl+C)
   # Then:
   cd "C:\Users\YAM-TECH\Documents\task monitoring system"
   Remove-Item "server\database\database.sqlite" -ErrorAction SilentlyContinue
   npm run dev
   ```

## Quick Test:

1. Login as admin: `admin@taskmonitor.com` / `admin123`
2. Click "+ Create New Task"
3. You should see a multi-select dropdown for "Assign To"
4. Try selecting multiple users (hold Ctrl and click)
5. Create the task
6. Check the task list - you should see:
   - Status as a badge (not dropdown)
   - Multiple users listed in "Assigned to"
   - Date filter inputs at the top

