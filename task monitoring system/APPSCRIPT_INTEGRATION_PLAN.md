# Google Apps Script Integration Plan

## Why Apps Script? ✅
- ✅ No Google Cloud setup needed
- ✅ No service account credentials needed
- ✅ Simpler authentication
- ✅ Script runs directly in your Google Sheet
- ✅ Free and easy to set up

---

## How It Works

### Architecture:
```
Python Flask App → HTTP Request → Google Apps Script → Google Sheets
```

**Flow:**
1. Admin assigns task → Flask app sends HTTP POST to Apps Script
2. Apps Script receives request → Writes to Google Sheets
3. User completes task → Flask app sends HTTP POST to Apps Script
4. Apps Script receives request → Updates Status in Google Sheets

---

## Implementation Steps

### Step 1: Create Apps Script in Google Sheet (You Do)

1. **Open your Google Sheet** "Task Monitoring System"
2. Click **Extensions** → **Apps Script**
3. A new Apps Script editor will open
4. I'll provide you the script code to paste there
5. Deploy as Web App
6. Get the Web App URL
7. Share the URL with me

### Step 2: Add Apps Script Code (I Provide, You Paste)

The script will have functions to:
- `doPost()` - Handle task creation (when admin assigns)
- Update task status (when user completes)
- Read tasks from sheet (optional)

### Step 3: Deploy as Web App (You Do)

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon → Select **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone** (or Anyone with Google account)
4. Click **Deploy**
5. **Copy the Web App URL** - this is what we need!

### Step 4: Python Code Integration (I Do)

1. Add HTTP request functions to call Apps Script
2. Modify task creation to call Apps Script
3. Modify task status update to call Apps Script

---

## What I Need From You

1. **Web App URL** (after deploying Apps Script)
   - Looks like: `https://script.google.com/macros/s/AKfycbz.../exec`

2. **Google Sheet Structure Confirmation**
   - Column A: User ID
   - Column B: Date
   - Column C: Task Description
   - Column D: Deadline
   - Column E: Status
   - Which row is the header? (Usually Row 1)

---

## Data Flow

### When Admin Assigns Task:
```
1. Admin fills form → Clicks "Create Task"
2. Flask app saves to SQLite
3. Flask app sends POST to Apps Script URL:
   {
     "action": "create_task",
     "user_id": 2,
     "date": "2024-01-15",
     "description": "Complete project report",
     "deadline": "2024-01-20",
     "status": "Pending"
   }
4. Apps Script receives request
5. Apps Script appends new row to "Task" sheet
```

### When User Completes Task:
```
1. User changes status to "Completed"
2. Flask app updates SQLite
3. Flask app sends POST to Apps Script URL:
   {
     "action": "update_status",
     "task_id": 5,
     "status": "Complete"
   }
4. Apps Script finds the task row
5. Apps Script updates Status column (Column E)
```

---

## Apps Script Functions Needed

1. **doPost(e)** - Main handler for all requests
   - Parse JSON from request
   - Route to appropriate function based on "action"
   
2. **createTask(data)** - Add new task row
   - Append to "Task" sheet
   - Set all columns correctly
   
3. **updateTaskStatus(data)** - Update status
   - Find task by ID or description
   - Update Status column

---

## Security Notes

- Apps Script Web App can be set to "Anyone" or require Google account
- For local testing, "Anyone" is fine
- For production, consider authentication
- Apps Script URL is secret - don't share publicly

---

## Benefits

✅ No Google Cloud setup
✅ No credentials.json file needed
✅ Script runs in your Google Sheet
✅ Easy to modify and maintain
✅ Free to use
✅ Real-time updates to Google Sheets

---

## Next Steps

1. **I provide** Apps Script code
2. **You paste** it in Apps Script editor
3. **You deploy** as Web App
4. **You share** the Web App URL
5. **I implement** Python side to call it

