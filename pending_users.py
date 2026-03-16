"""
Pending Users Storage - Stores users before admin approval
Users are only written to Google Sheets after admin approval
"""
import json
import os
from datetime import datetime

PENDING_USERS_FILE = 'pending_users.json'

def get_pending_users_file():
    """Get the path to pending users file"""
    return PENDING_USERS_FILE

def load_pending_users():
    """Load pending users from JSON file"""
    if not os.path.exists(PENDING_USERS_FILE):
        return []
    
    try:
        with open(PENDING_USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def save_pending_users(users):
    """Save pending users to JSON file"""
    try:
        with open(PENDING_USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2, ensure_ascii=False)
        return True
    except IOError as e:
        print(f"[Pending Users] Error saving: {str(e)}")
        return False

def add_pending_user(username, email, password):
    """Add a new pending user"""
    users = load_pending_users()
    
    # Check if user already exists (by email)
    if any(user.get('email') == email for user in users):
        return {'success': False, 'error': 'Email already exists in pending users'}
    
    # Generate a temporary ID (will be replaced when approved and written to Sheets)
    max_id = max([user.get('id', 0) for user in users] + [0])
    new_id = max_id + 1
    
    new_user = {
        'id': new_id,
        'username': username,
        'email': email,
        'password': password,  # Already hashed
        'approval_status': 'pending',
        'role': 'user',
        'created_at': datetime.now().isoformat()
    }
    
    users.append(new_user)
    
    if save_pending_users(users):
        return {'success': True, 'user': new_user}
    else:
        return {'success': False, 'error': 'Failed to save pending user'}

def get_pending_user_by_email(email):
    """Get a pending user by email"""
    users = load_pending_users()
    for user in users:
        if user.get('email') == email:
            return user
    return None

def remove_pending_user(email):
    """Remove a pending user (after approval or rejection)"""
    users = load_pending_users()
    users = [user for user in users if user.get('email') != email]
    return save_pending_users(users)

def get_all_pending_users():
    """Get all pending users"""
    return load_pending_users()

