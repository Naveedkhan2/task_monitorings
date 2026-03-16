# Troubleshooting: Pending Users Approval Section Not Showing

## Changes Made:
✅ **Section now always visible** - Shows even if no pending users (displays "No users pending approval")
✅ **Better error handling** - Logs errors to console
✅ **Fallback method** - If Google Sheets doesn't support `get_pending_users`, it filters from all users

## Steps to See Pending Users:

### 1. **Check Browser Console for Errors:**
   - Press `F12` in your browser
   - Go to "Console" tab
   - Look for errors when loading admin dashboard
   - Check for: "Error fetching pending users" or "[Pending Users]" messages

### 2. **Verify Google Sheets Setup:**
   
   The Google Apps Script needs to support `approval_status` column in SignUp sheet:
   
   **Option A: Update Google Apps Script** (if you have access):
   - Add `approval_status` column to SignUp sheet
   - Add `get_pending_users` action handler
   - Or just ensure `approval_status` column exists (fallback will work)
   
   **Option B: Use Fallback Method** (automatic):
   - The code now automatically falls back to filtering all users
   - It looks for users with `approval_status = 'pending'`
   - Just need `approval_status` column in Google Sheets

### 3. **Test by Creating a Pending User:**
   ```powershell
   # 1. Sign up as a new user
   # 2. Login as admin
   # 3. Check admin dashboard - should see pending user section
   ```

### 4. **Check Server Console:**
   Look for these messages in Python server console:
   ```
   [Pending Users] get_pending_users returned empty, trying fallback method...
   [Pending Users] Fallback found X pending users
   [Pending Users] Returning X pending users
   ```

### 5. **Manual Check - View All Users:**
   The fallback method will show pending users if:
   - `approval_status` column exists in Google Sheets SignUp sheet
   - Column value is exactly "pending" (case-insensitive)

## Expected Behavior:

### If No Pending Users:
- Section shows: "Pending User Approvals (0)"
- Message: "No users pending approval at this time"
- Gray background

### If Pending Users Exist:
- Section shows: "Pending User Approvals (X)"
- Yellow background
- Click "Show Pending Users" to see the list
- Approve/Reject buttons for each user

## Quick Test:

1. **Sign up a new user** (will have `approval_status = 'pending'`)
2. **Login as admin**
3. **Check admin dashboard** - should see yellow banner
4. **If not visible**, check browser console (F12) for errors

## If Still Not Showing:

### Check 1: Is the section rendering?
- Open browser DevTools (F12)
- Go to Elements/Inspector tab
- Search for "Pending User Approvals"
- If found but hidden, check CSS

### Check 2: Is API being called?
- Go to Network tab in DevTools
- Refresh admin dashboard
- Look for request to `/api/admin/pending-users`
- Check response - should return `{users: [...]}`

### Check 3: Are there actually pending users?
- Check Google Sheets SignUp tab
- Look for `approval_status` column
- Verify it contains "pending" for some users

### Check 4: Check Server Logs:
- Look at Python console output
- Should see: `[Pending Users] Returning X pending users`

