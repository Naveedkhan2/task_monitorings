
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

