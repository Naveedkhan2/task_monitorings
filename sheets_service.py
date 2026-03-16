"""
Google Sheets Service - Handles all database operations via Apps Script
"""
import requests
import json
import os

class SheetsService:
    def __init__(self):
        # Get Web App URL from environment or config
        self.web_app_url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL', '')
        
    def is_configured(self):
        """Check if Google Sheets is configured"""
        return bool(self.web_app_url)
    
    def _make_request(self, action, data):
        """Make HTTP POST request to Apps Script"""
        if not self.is_configured():
            print(f"[Sheets Service] Not configured. Would send: {action}")
            return {'success': False, 'error': 'Google Sheets not configured'}
        
        try:
            payload = {
                'action': action,
                **data
            }
            
            response = requests.post(
                self.web_app_url,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                # Debug logging for get_user action
                if action == 'get_user' and result.get('success'):
                    user = result.get('user', {})
                    print(f"[Sheets Service] get_user response - Role: {repr(user.get('role'))}")
                return result
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}'}
                
        except Exception as e:
            print(f"[Sheets Service] Error: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    # User operations
    def signup_user(self, username, email, password, approval_status='pending'):
        """Sign up a new user with approval status"""
        return self._make_request('signup', {
            'username': username,
            'email': email,
            'password': password,
            'approval_status': approval_status
        })
    
    def login_user(self, email, password):
        """Login user - returns user data if credentials match"""
        return self._make_request('login', {
            'email': email,
            'password': password
        })
    
    def get_user_by_email(self, email):
        """Get user data by email (for password verification)"""
        # This will be used to get user data, then verify password in Flask
        # We'll modify Apps Script to support this, or use login with hash
        return self._make_request('get_user', {
            'email': email
        })
    
    def update_user(self, email, password=None, role=None, user_id=None, username=None, approval_status=None):
        """Update user information"""
        data = {'email': email}
        if password is not None:
            data['password'] = password
        if role is not None:
            data['role'] = role
        if user_id is not None:
            data['user_id'] = user_id
        if username is not None:
            data['username'] = username
        if approval_status is not None:
            data['approval_status'] = approval_status
        return self._make_request('update_user', data)
    
    def get_pending_users(self):
        """Get all users pending approval"""
        result = self._make_request('get_pending_users', {})
        print(f"[Sheets Service] get_pending_users result: {result}")
        if result.get('success') and 'users' in result:
            return result['users']
        # If action not supported, return empty list (will use fallback in app.py)
        if not result.get('success') and 'not configured' not in str(result.get('error', '')).lower():
            print(f"[Sheets Service] get_pending_users failed: {result.get('error')}")
        return []
    
    # Task operations
    def create_task(self, user_id, description, deadline, status='Pending'):
        """Create a new task"""
        from datetime import datetime
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        return self._make_request('create_task', {
            'user_id': user_id,
            'date': current_date,
            'description': description,
            'deadline': deadline,
            'status': status
        })
    
    def update_task_status(self, user_id, description, status):
        """Update task status"""
        return self._make_request('update_status', {
            'user_id': user_id,
            'description': description,
            'status': status
        })
    
    def get_tasks(self, user_id=None):
        """Get tasks - if user_id provided, get user tasks, else all tasks"""
        data = {}
        if user_id:
            data['user_id'] = user_id
        
        result = self._make_request('get_tasks', data)
        
        if result.get('success') and 'tasks' in result:
            return result['tasks']
        return []
    
    def get_all_tasks(self):
        """Get all tasks (for admin)"""
        return self.get_tasks(user_id=None)
    
    def get_all_users(self):
        """Get all users from SignUp sheet"""
        result = self._make_request('get_all_users', {})
        
        if result.get('success') and 'users' in result:
            return result['users']
        return []

