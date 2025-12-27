# Google Sheets Integration Plan

## Overview
Integrate Google Sheets as the database backend for task management. Tasks assigned by admin and completed by users will sync with Google Sheets in real-time.

---

## Current System Status ✅

### Already Working:
1. **User Signup** - Saves to SQLite database (users table)
2. **User Signin** - Reads from SQLite database and matches credentials
3. **Admin Panel** - Can assign tasks (saved to SQLite)
4. **User Panel** - Can view and update task status (in SQLite)

---

## What We Need to Add 🔧

### 1. Google Sheets Integration for Tasks
- Connect to Google Sheets API
- Save tasks to Google Sheets when admin assigns them
- Update task status in Google Sheets when user marks as complete
- Read tasks from Google Sheets to display in admin/user panels

### 2. Data Flow:

**Admin Assigns Task:**
```
Admin assigns task → Save to SQLite (existing) → Save to Google Sheets (new)
```

**User Completes Task:**
```
User marks complete → Update SQLite (existing) → Update Google Sheets (new)
```

---

## Implementation Steps

### Step 1: Google Cloud Setup (You Need to Do)
1. Create Google Cloud Project
2. Enable Google Sheets API
3. Create Service Account
4. Download JSON credentials
5. Share Google Sheet with service account email

### Step 2: Code Implementation (I Will Do)
1. Add Google Sheets API library
2. Create Google Sheets service module
3. Modify task creation to write to Google Sheets
4. Modify task status update to update Google Sheets
5. Optionally: Read tasks from Google Sheets instead of SQLite

### Step 3: Configuration (You Need to Provide)
- Google Sheet ID (from sheet URL)
- JSON credentials file

---

## Google Sheets Structure

Based on your screenshots, you have two sheets:

### Sheet 1: "SignUp" (Optional - can keep SQLite for users)
- User ID
- User Name
- Email
- Password

### Sheet 2: "Task" (Main focus)
- User ID
- Date
- Task Description
- Deadline
- Status (Pending/Complete)

---

## What I Need From You

### Required:
1. **Google Sheet ID**
   - Open your Google Sheet
   - Copy the Sheet ID from the URL
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - The ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

2. **Google Cloud Credentials JSON File**
   - After creating service account, download the JSON file
   - Save it as `credentials.json` in the project folder

### Optional (if different from screenshots):
- Confirm column structure matches:
  - Column A: User ID
  - Column B: Date
  - Column C: Task Description
  - Column D: Deadline
  - Column E: Status

---

## How It Will Work

### Scenario 1: Admin Assigns Task
1. Admin fills task form (title, description, assign to user, deadline)
2. Clicks "Create Task"
3. **System saves to SQLite** (for fast local access)
4. **System writes to Google Sheets** (for permanent storage):
   - User ID (assigned user)
   - Date (current date)
   - Task Description
   - Deadline
   - Status = "Pending"

### Scenario 2: User Completes Task
1. User views their tasks
2. Changes status dropdown to "Completed"
3. **System updates SQLite** (status = "completed")
4. **System updates Google Sheets** (Status column = "Complete" for that task)

---

## Benefits

✅ Data automatically backed up to Google Sheets
✅ Can view/edit tasks directly in Google Sheets
✅ Data persists even if local database is deleted
✅ Can share sheet with team members
✅ Historical data in Google Sheets

---

## Technical Details

### Libraries Needed:
- `google-api-python-client` - Google Sheets API
- `google-auth` - Authentication
- `google-auth-oauthlib` - OAuth support

### How Data Will Sync:
- **Write to Sheets:** Every time a task is created/updated
- **Read from Sheets:** Optional (can keep using SQLite for reads, Sheets for backup)
- **Both approaches possible:**
  - Option A: SQLite primary, Sheets backup (recommended for speed)
  - Option B: Sheets primary, SQLite cache (slower but fully cloud-based)

---

## Next Steps

1. **You:** Set up Google Cloud and share credentials
2. **Me:** Implement Google Sheets integration code
3. **You:** Test by assigning tasks and checking Google Sheets
4. **Both:** Verify data syncs correctly

---

## Questions to Confirm

1. Do you want to keep SQLite for users, or move everything to Google Sheets?
2. Should tasks be read from Google Sheets or SQLite? (SQLite faster, Sheets more accessible)
3. What exact column names should we use in Google Sheets? (Match your current sheet structure)

