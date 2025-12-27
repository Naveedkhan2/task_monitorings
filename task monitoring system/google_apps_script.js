/**
 * Google Apps Script for Task Monitoring System
 * 
 * This script handles ALL database operations - both SignUp and Tasks
 * 
 * Instructions:
 * 1. Open your Google Sheet "Task Monitoring System"
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire code
 * 5. Save (Ctrl+S)
 * 6. Click Deploy → New deployment
 * 7. Select "Web app"
 * 8. Execute as: "Me"
 * 9. Who has access: "Anyone" (for testing)
 * 10. Click Deploy
 * 11. Copy the Web App URL and share it
 */

// Configuration - Sheet names
const SIGNUP_SHEET = 'SignUp'; // Sheet for user signups
const TASK_SHEET = 'Task';     // Sheet for tasks

// SignUp Sheet Column indices
const SIGNUP_COL_USER_ID = 1;      // Column A - User ID
const SIGNUP_COL_USER_NAME = 2;    // Column B - User Name
const SIGNUP_COL_EMAIL = 3;        // Column C - Email
const SIGNUP_COL_PASSWORD = 4;     // Column D - Password
const SIGNUP_COL_ROLE = 5;         // Column E - Role (admin/user)

// Task Sheet Column indices
const TASK_COL_USER_ID = 1;        // Column A - User ID
const TASK_COL_DATE = 2;           // Column B - Date
const TASK_COL_DESCRIPTION = 3;    // Column C - Task Description
const TASK_COL_DEADLINE = 4;       // Column D - Deadline
const TASK_COL_STATUS = 5;         // Column E - Status



const HEADER_ROW = 1; // Row number where headers are

/**
 * Main function to handle POST requests from Flask app
 */
function doPost(e) {
  try {
    // Parse JSON from request
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Route to appropriate function
    switch(action) {
      case 'signup':
        return signupUser(data);
      case 'login':
        return loginUser(data);
      case 'update_user':
        return updateUser(data);
      case 'create_task':
        return createTask(data);
      case 'update_status':
        return updateTaskStatus(data);
      case 'get_tasks':
        return getTasks(data);
      case 'get_all_tasks':
        return getAllTasks(data);
      case 'get_user':
        return getUserByEmail(data);
      case 'get_all_users':
        return getAllUsers(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Unknown action: ' + action
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'Task Monitoring System - Apps Script Web App',
    status: 'running',
    sheets: {
      signup: SIGNUP_SHEET,
      task: TASK_SHEET
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sign up a new user
 * 
 * Expected data:
 * {
 *   "action": "signup",
 *   "username": "john",
 *   "email": "john@example.com",
 *   "password": "hashed_password"
 * }
 */
function signupUser(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SIGNUP_SHEET);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SIGNUP_SHEET);
      // Add headers
      sheet.getRange(HEADER_ROW, SIGNUP_COL_USER_ID).setValue('User ID');
      sheet.getRange(HEADER_ROW, SIGNUP_COL_USER_NAME).setValue('User Name');
      sheet.getRange(HEADER_ROW, SIGNUP_COL_EMAIL).setValue('Email');
      sheet.getRange(HEADER_ROW, SIGNUP_COL_PASSWORD).setValue('Password');
      sheet.getRange(HEADER_ROW, SIGNUP_COL_ROLE).setValue('Role');
      // Format header row
      sheet.getRange(HEADER_ROW, 1, 1, 5).setFontWeight('bold');
    }
    
    // Add Role header if it doesn't exist (for existing sheets)
    const roleHeader = sheet.getRange(HEADER_ROW, SIGNUP_COL_ROLE).getValue();
    if (!roleHeader || roleHeader === '') {
      sheet.getRange(HEADER_ROW, SIGNUP_COL_ROLE).setValue('Role');
    }
    
    // Check if email already exists
    const lastRow = sheet.getLastRow();
    if (lastRow >= HEADER_ROW + 1) {
      const emailRange = sheet.getRange(HEADER_ROW + 1, SIGNUP_COL_EMAIL, lastRow - HEADER_ROW, 1);
      const emails = emailRange.getValues();
      for (let i = 0; i < emails.length; i++) {
        if (emails[i][0] === data.email) {
          return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Email already exists'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // Find next user ID (or use provided user_id)
    let nextUserId;
    if (data.user_id) {
      // Use provided user_id
      nextUserId = data.user_id;
    } else {
      // Auto-generate next user ID
      nextUserId = 1;
      if (lastRow >= HEADER_ROW + 1) {
        const idRange = sheet.getRange(HEADER_ROW + 1, SIGNUP_COL_USER_ID, lastRow - HEADER_ROW, 1);
        const ids = idRange.getValues();
        let maxId = 0;
        for (let i = 0; i < ids.length; i++) {
          if (ids[i][0] > maxId) maxId = ids[i][0];
        }
        nextUserId = maxId + 1;
      }
    }
    
    // Add new user
    const newRow = lastRow + 1;
    const userRole = data.role || 'user'; // Default to 'user' if not specified
    sheet.getRange(newRow, SIGNUP_COL_USER_ID).setValue(nextUserId);
    sheet.getRange(newRow, SIGNUP_COL_USER_NAME).setValue(data.username);
    sheet.getRange(newRow, SIGNUP_COL_EMAIL).setValue(data.email);
    sheet.getRange(newRow, SIGNUP_COL_PASSWORD).setValue(data.password);
    sheet.getRange(newRow, SIGNUP_COL_ROLE).setValue(userRole);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'User created successfully',
      user: {
        id: nextUserId,
        username: data.username,
        email: data.email,
        role: userRole
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Login user - verify credentials
 * 
 * Expected data:
 * {
 *   "action": "login",
 *   "email": "john@example.com",
 *   "password": "hashed_password"
 * }
 */
function loginUser(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SIGNUP_SHEET);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'SignUp sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < HEADER_ROW + 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Search for user by email
    const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 5);
    const values = dataRange.getValues();
    
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const userId = row[SIGNUP_COL_USER_ID - 1];
      const username = row[SIGNUP_COL_USER_NAME - 1];
      const email = row[SIGNUP_COL_EMAIL - 1];
      const password = row[SIGNUP_COL_PASSWORD - 1];
      const role = row[SIGNUP_COL_ROLE - 1] || 'user'; // Get role from sheet, default to 'user'
      
      if (email === data.email && password === data.password) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: 'Login successful',
          user: {
            id: userId,
            username: username,
            email: email,
            role: role
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid credentials'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Create a new task in Google Sheets
 * 
 * Expected data:
 * {
 *   "action": "create_task",
 *   "user_id": 2,
 *   "date": "2024-01-15",
 *   "description": "Complete project report",
 *   "deadline": "2024-01-20",
 *   "status": "Pending"
 * }
 */
function createTask(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(TASK_SHEET);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(TASK_SHEET);
      // Add headers
      sheet.getRange(HEADER_ROW, TASK_COL_USER_ID).setValue('User ID');
      sheet.getRange(HEADER_ROW, TASK_COL_DATE).setValue('Date');
      sheet.getRange(HEADER_ROW, TASK_COL_DESCRIPTION).setValue('Task Description');
      sheet.getRange(HEADER_ROW, TASK_COL_DEADLINE).setValue('Deadline');
      sheet.getRange(HEADER_ROW, TASK_COL_STATUS).setValue('Status');
      // Format header row
      sheet.getRange(HEADER_ROW, 1, 1, 5).setFontWeight('bold');
    }
    
    // Find the next empty row
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    // Add task data
    sheet.getRange(newRow, TASK_COL_USER_ID).setValue(data.user_id || '');
    sheet.getRange(newRow, TASK_COL_DATE).setValue(data.date || new Date());
    sheet.getRange(newRow, TASK_COL_DESCRIPTION).setValue(data.description || '');
    sheet.getRange(newRow, TASK_COL_DEADLINE).setValue(data.deadline || '');
    sheet.getRange(newRow, TASK_COL_STATUS).setValue(data.status || 'Pending');
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Task created successfully',
      row: newRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Update task status in Google Sheets
 * 
 * Expected data:
 * {
 *   "action": "update_status",
 *   "user_id": 2,
 *   "description": "Complete project report",
 *   "status": "Complete"
 * }
 */
function updateTaskStatus(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(TASK_SHEET);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Task sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= HEADER_ROW) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No tasks found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Search for task by user_id and description
    const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 5);
    const values = dataRange.getValues();
    
    let rowToUpdate = null;
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const userId = row[TASK_COL_USER_ID - 1];
      const description = row[TASK_COL_DESCRIPTION - 1];
      
      if (userId == data.user_id && description == data.description) {
        rowToUpdate = HEADER_ROW + 1 + i;
        break;
      }
    }
    
    if (!rowToUpdate) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Task not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Update status
    sheet.getRange(rowToUpdate, TASK_COL_STATUS).setValue(data.status || 'Complete');
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Status updated successfully',
      row: rowToUpdate
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get tasks for a specific user
 * 
 * Expected data:
 * {
 *   "action": "get_tasks",
 *   "user_id": 2
 * }
 */
function getTasks(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(TASK_SHEET);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        tasks: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= HEADER_ROW) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        tasks: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 5);
    const values = dataRange.getValues();
    
    const tasks = [];
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const userId = row[TASK_COL_USER_ID - 1];
      
      // Filter by user_id if provided
      if (!data.user_id || userId == data.user_id) {
        tasks.push({
          row: HEADER_ROW + 1 + i,
          user_id: userId,
          date: row[TASK_COL_DATE - 1],
          description: row[TASK_COL_DESCRIPTION - 1],
          deadline: row[TASK_COL_DEADLINE - 1],
          status: row[TASK_COL_STATUS - 1]
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      tasks: tasks
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all tasks (for admin)
 */
function getAllTasks(data) {
  return getTasks({ action: 'get_tasks', user_id: null });
}

/**
 * Update user information (password, role, user_id, etc.)
 * 
 * Expected data:
 * {
 *   "action": "update_user",
 *   "email": "user@example.com",
 *   "password": "new_hashed_password" (optional),
 *   "role": "admin" (optional),
 *   "user_id": 123 (optional),
 *   "username": "New Name" (optional)
 * }
 */
function updateUser(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SIGNUP_SHEET);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'SignUp sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < HEADER_ROW + 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'User not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Search for user by email
    const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 5);
    const values = dataRange.getValues();
    
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const email = row[SIGNUP_COL_EMAIL - 1];
      
      if (email === data.email) {
        const rowToUpdate = HEADER_ROW + 1 + i;
        
        // Update fields if provided
        if (data.user_id !== undefined) {
          sheet.getRange(rowToUpdate, SIGNUP_COL_USER_ID).setValue(data.user_id);
        }
        if (data.username !== undefined) {
          sheet.getRange(rowToUpdate, SIGNUP_COL_USER_NAME).setValue(data.username);
        }
        if (data.password !== undefined) {
          sheet.getRange(rowToUpdate, SIGNUP_COL_PASSWORD).setValue(data.password);
        }
        if (data.role !== undefined) {
          sheet.getRange(rowToUpdate, SIGNUP_COL_ROLE).setValue(data.role);
        }
        
        // Get updated user data
        const updatedUserId = data.user_id !== undefined ? data.user_id : row[SIGNUP_COL_USER_ID - 1];
        const updatedUsername = data.username !== undefined ? data.username : row[SIGNUP_COL_USER_NAME - 1];
        const updatedPassword = data.password !== undefined ? data.password : row[SIGNUP_COL_PASSWORD - 1];
        const updatedRole = data.role !== undefined ? data.role : (row[SIGNUP_COL_ROLE - 1] || 'user');
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: 'User updated successfully',
          user: {
            id: updatedUserId,
            username: updatedUsername,
            email: email,
            role: updatedRole
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'User not found'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get user by email (for password verification)
 */
function getUserByEmail(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SIGNUP_SHEET);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'SignUp sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < HEADER_ROW + 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'User not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 5);
    const values = dataRange.getValues();
    
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const userId = row[SIGNUP_COL_USER_ID - 1];
      const username = row[SIGNUP_COL_USER_NAME - 1];
      const email = row[SIGNUP_COL_EMAIL - 1];
      const password = row[SIGNUP_COL_PASSWORD - 1];
      const role = row[SIGNUP_COL_ROLE - 1] || 'user'; // Get role from sheet, default to 'user'
      
      if (email === data.email) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          user: {
            id: userId,
            username: username,
            email: email,
            role: role,
            password: password
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'User not found'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all users from SignUp sheet
 * Reads from the "User Name" column (Column B) in the SignUp sheet
 * 
 * Expected data:
 * {
 *   "action": "get_all_users"
 * }
 */
function getAllUsers(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SIGNUP_SHEET);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        users: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < HEADER_ROW + 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        users: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Read all user data (5 columns: ID, User Name, Email, Password, Role)
    const dataRange = sheet.getRange(HEADER_ROW + 1, 1, lastRow - HEADER_ROW, 5);
    const values = dataRange.getValues();
    
    const users = [];
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const userId = row[SIGNUP_COL_USER_ID - 1];
      const username = row[SIGNUP_COL_USER_NAME - 1]; // Column B - User Name
      const email = row[SIGNUP_COL_EMAIL - 1];
      const role = row[SIGNUP_COL_ROLE - 1] || 'user';
      
      // Only include users that have valid data
      if (userId && username && email) {
        users.push({
          id: userId,
          username: username, // This is from the "User Name" column
          email: email,
          role: role
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      users: users
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

