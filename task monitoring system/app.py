from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import jwt
import datetime
import os
from dotenv import load_dotenv
from sheets_service import SheetsService
from datetime import timezone
from pending_users import add_pending_user, get_pending_user_by_email, remove_pending_user, get_all_pending_users

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
CORS(app)

# Initialize Google Sheets service
sheets_service = SheetsService()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = {
                'id': data['id'],
                'username': data['username'],
                'email': data['email'],
                'role': data['role']
            }
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if current_user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Auth Routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    # Check if user already exists in Google Sheets (approved users)
    existing_user = sheets_service.get_user_by_email(email)
    if existing_user.get('success') and existing_user.get('user'):
        return jsonify({'error': 'Email already exists'}), 400
    
    # Check if user already exists in pending users
    pending_user = get_pending_user_by_email(email)
    if pending_user:
        return jsonify({'error': 'Email already exists in pending approval'}), 400
    
    # Hash password before storing
    hashed_password = generate_password_hash(password)
    
    # Store in pending users (NOT in Google Sheets yet)
    result = add_pending_user(username, email, hashed_password)
    
    if not result.get('success'):
        error = result.get('error', 'Signup failed')
        return jsonify({'error': error}), 500
    
    user_data = result.get('user', {})
    
    # Don't generate token or login - user needs admin approval
    return jsonify({
        'message': 'Signup successful! Your account is pending admin approval. You will be notified once approved.',
        'requires_approval': True,
        'user': {
            'username': user_data.get('username'),
            'email': user_data.get('email'),
            'approval_status': 'pending'
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # First check if user is in pending users (not approved yet)
    pending_user = get_pending_user_by_email(email)
    if pending_user:
        # Verify password for pending user
        if check_password_hash(pending_user.get('password', ''), password):
            return jsonify({'error': 'Admin approve first'}), 403
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    
    # Get user from Google Sheets by email (approved users only)
    print(f"[Login Debug] Calling get_user_by_email for: {email}")
    result = sheets_service.get_user_by_email(email)
    print(f"[Login Debug] Result from get_user_by_email: {result}")
    
    if not result.get('success') or not result.get('user'):
        print(f"[Login Debug] ERROR: get_user_by_email failed or user not found")
        return jsonify({'error': 'Invalid credentials'}), 401
    
    user_data = result.get('user', {})
    
    # Check if user is approved (admin is always approved)
    approval_status = user_data.get('approval_status', '').strip().lower()
    user_role = user_data.get('role', '').strip().lower()
    
    if user_role != 'admin' and approval_status not in ['approved', '']:
        if approval_status == 'pending':
            return jsonify({'error': 'Admin approve first'}), 403
        elif approval_status == 'rejected':
            return jsonify({'error': 'Your account has been rejected. Please contact administrator.'}), 403
        else:
            return jsonify({'error': 'Admin approve first'}), 403
    
    # Debug: Log what we received from Google Sheets
    print(f"[Login Debug] ========== USER DATA FROM GOOGLE SHEETS ==========")
    print(f"[Login Debug] Full user_data: {user_data}")
    print(f"[Login Debug] user_data keys: {list(user_data.keys())}")
    print(f"[Login Debug] user_data.get('role'): {repr(user_data.get('role'))}")
    print(f"[Login Debug] user_data.get('role') type: {type(user_data.get('role'))}")
    print(f"[Login Debug] user_data.get('role') == 'admin': {user_data.get('role') == 'admin'}")
    print(f"[Login Debug] ===================================================")
    
    stored_password = user_data.get('password', '')
    
    # Debug: Check if password exists
    if not stored_password:
        print(f"[Login Debug] User {email} found but password is empty in Google Sheets")
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Verify password using werkzeug's check_password_hash
    if not check_password_hash(stored_password, password):
        print(f"[Login Debug] Password verification failed for {email}")
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Remove password from user data before sending response
    raw_role = user_data.get('role')
    print(f"[Login Debug] Raw role from user_data: {repr(raw_role)} (type: {type(raw_role)})")
    
    # Clean role - remove whitespace and convert to lowercase for comparison
    if raw_role:
        role = str(raw_role).strip().lower()
    else:
        role = 'user'
        print(f"[Login Debug] WARNING: Role is empty/None, defaulting to 'user'")
    
    print(f"[Login Debug] Cleaned role: '{role}'")
    
    user_response = {
        'id': user_data.get('id'),
        'username': user_data.get('username'),
        'email': user_data.get('email'),
        'role': role
    }
    
    # Debug logging
    print(f"[Login] User {email} logged in with role: '{role}'")
    print(f"[Login] Full user_response: {user_response}")
    
    # Generate JWT token
    token = jwt.encode({
        'id': user_response['id'],
        'username': user_response['username'],
        'email': user_response['email'],
        'role': role,
        'exp': datetime.datetime.now(timezone.utc) + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user_response
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user})

# Task Routes
@app.route('/api/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    # Get date filter parameters
    start_date = request.args.get('startDate', '')
    end_date = request.args.get('endDate', '')
    
    # Get tasks from Google Sheets
    if current_user['role'] == 'admin':
        tasks = sheets_service.get_all_tasks()
    else:
        tasks = sheets_service.get_tasks(user_id=current_user['id'])
    
    # Apply date filtering if provided
    if start_date or end_date:
        filtered_tasks = []
        for task in tasks:
            task_date = task.get('date', '')
            if start_date and task_date < start_date:
                continue
            if end_date and task_date > end_date:
                continue
            filtered_tasks.append(task)
        tasks = filtered_tasks
    
    # Group tasks by description and deadline (same task assigned to multiple users)
    # Since Google Sheets stores one row per user, we need to group them
    task_groups = {}
    for task in tasks:
        description = task.get('description', '')
        deadline = task.get('deadline', '')
        # Use description + deadline as unique identifier (same task, same deadline)
        task_key = f"{description}|{deadline}"
        
        if task_key not in task_groups:
            # Use first line of description as title
            title = description.split('\n')[0] if description else ''
            task_groups[task_key] = {
                'id': task.get('row'),  # Use first row as ID
                'title': title,
                'description': description,
                'deadline': deadline,
                'status': task.get('status', 'pending').lower(),
                'user_ids': [],
                'assigned_to_names': [],
                'date': task.get('date', ''),
                'rows': []  # Track all row IDs for this task
            }
        
        # Add user to this task group
        user_id = task.get('user_id')
        row_id = task.get('row')
        if user_id and user_id not in task_groups[task_key]['user_ids']:
            task_groups[task_key]['user_ids'].append(user_id)
        if row_id and row_id not in task_groups[task_key]['rows']:
            task_groups[task_key]['rows'].append(row_id)
    
    # Optimize: Cache user lookup (single fetch, used for all tasks)
    all_users = sheets_service.get_all_users()
    user_lookup = {user.get('id'): user.get('username') for user in all_users}
    
    # Build final task list with multiple users (optimized: list comprehension)
    tasks_list = [
        {
            'id': task_data['id'],
            'title': task_data['title'],
            'description': task_data['description'],
            'deadline': task_data['deadline'],
            'status': task_data['status'],
            'assigned_to_names': [user_lookup.get(uid, f'User {uid}') for uid in task_data['user_ids']],
            'assigned_to_name': ', '.join(user_lookup.get(uid, f'User {uid}') for uid in task_data['user_ids']) if task_data['user_ids'] else 'Unassigned',
            'assigned_to': task_data['user_ids'][0] if task_data['user_ids'] else None  # Keep for compatibility
        }
        for task_data in task_groups.values()
    ]
    
    return jsonify(tasks_list)

@app.route('/api/tasks', methods=['POST'])
@admin_required
def create_task(current_user):
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    assigned_to = data.get('assigned_to', [])  # Now expects an array
    deadline = data.get('deadline')
    
    # Validate input
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    
    if not assigned_to or (isinstance(assigned_to, list) and len(assigned_to) == 0):
        return jsonify({'error': 'At least one user must be assigned'}), 400
    
    # Convert single value to list for backward compatibility
    if not isinstance(assigned_to, list):
        assigned_to = [assigned_to]
    
    # Combine title and description for task description in Sheets
    full_description = title
    if description:
        full_description += f"\n{description}"
    
    # Create task for each assigned user (Google Sheets stores one row per user)
    created_tasks = []
    errors = []
    
    for user_id in assigned_to:
        result = sheets_service.create_task(
            user_id=user_id,
            description=full_description,
            deadline=deadline or '',
            status='In Progress'
        )
        
        if result.get('success'):
            created_tasks.append(result.get('row'))
        else:
            errors.append(f"Failed to assign to user {user_id}: {result.get('error', 'Unknown error')}")
    
    if len(created_tasks) == 0:
        return jsonify({'error': 'Failed to create task. ' + '; '.join(errors)}), 500
    
    return jsonify({
        'message': f'Task created successfully for {len(created_tasks)} user(s)',
        'id': created_tasks[0],  # Return first task ID
        'task_ids': created_tasks
    }), 201

@app.route('/api/tasks/<int:task_id>/status', methods=['PATCH'])
@token_required
def update_task_status(current_user, task_id):
    # Admin cannot update task status
    if current_user['role'] == 'admin':
        return jsonify({'error': 'Admin cannot update task status. Only assigned users can update status.'}), 403
    
    data = request.json
    status = data.get('status')
    
    # Convert status to match Sheets format
    status_map = {
        'pending': 'Pending',
        'in_progress': 'In Progress',
        'completed': 'Complete'
    }
    sheets_status = status_map.get(status, status.title())
    
    # Get user's tasks to find the task
    tasks = sheets_service.get_tasks(user_id=current_user['id'])
    
    # Find task by row number (task_id)
    task = None
    for t in tasks:
        if t.get('row') == task_id:
            task = t
            break
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    # User can only update their own tasks
    if task.get('user_id') != current_user['id']:
        return jsonify({'error': 'Access denied'}), 403
    
    # Update status in Google Sheets
    result = sheets_service.update_task_status(
        user_id=task.get('user_id'),
        description=task.get('description'),
        status=sheets_status
    )
    
    if not result.get('success'):
        return jsonify({'error': result.get('error', 'Failed to update task')}), 500
    
    return jsonify({'message': 'Task status updated successfully'})

# Dashboard Routes
@app.route('/api/dashboard/user', methods=['GET'])
@token_required
def get_user_dashboard(current_user):
    # Get user tasks from Google Sheets
    tasks = sheets_service.get_tasks(user_id=current_user['id'])
    
    # Calculate stats
    total_tasks = len(tasks)
    pending_tasks = sum(1 for t in tasks if t.get('status', '').lower() == 'pending')
    in_progress_tasks = sum(1 for t in tasks if 'progress' in t.get('status', '').lower())
    completed_tasks = sum(1 for t in tasks if t.get('status', '').lower() == 'complete')
    
    # Check overdue (simplified - compare deadline strings)
    overdue_tasks = 0
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    for task in tasks:
        deadline = task.get('deadline', '')
        status = task.get('status', '').lower()
        if deadline and deadline < today and status != 'complete':
            overdue_tasks += 1
    
    return jsonify({
        'stats': {
            'total_tasks': total_tasks,
            'pending_tasks': pending_tasks,
            'in_progress_tasks': in_progress_tasks,
            'completed_tasks': completed_tasks,
            'overdue_tasks': overdue_tasks
        },
        'recentTasks': tasks[:5]  # First 5 tasks as recent
    })

# Configuration check endpoint
@app.route('/api/config/status', methods=['GET'])
def get_config_status():
    """Check if Google Sheets is configured"""
    is_configured = sheets_service.is_configured()
    return jsonify({
        'google_sheets_configured': is_configured,
        'message': 'Google Sheets is configured' if is_configured else 'Google Sheets not configured. Please set GOOGLE_SHEETS_WEB_APP_URL environment variable.'
    })

# Admin Approval Routes
@app.route('/api/admin/pending-users', methods=['GET'])
@admin_required
def get_pending_users(current_user):
    """Get all users pending approval"""
    try:
        # Get pending users from local storage (not Google Sheets)
        pending_users = get_all_pending_users()
        print(f"[Pending Users] Returning {len(pending_users)} pending users from local storage")
        return jsonify({'users': pending_users})
    except Exception as e:
        print(f"[Pending Users] Error: {str(e)}")
        return jsonify({'users': [], 'error': 'Could not fetch pending users'})

@app.route('/api/admin/approve-user', methods=['POST'])
@admin_required
def approve_user(current_user):
    """Approve a pending user - write to Google Sheets"""
    data = request.json
    email = data.get('email')
    user_id = data.get('user_id')
    
    if not email and not user_id:
        return jsonify({'error': 'Email or user_id is required'}), 400
    
    # Get pending user from local storage
    pending_user = None
    if email:
        pending_user = get_pending_user_by_email(email)
    elif user_id:
        all_pending = get_all_pending_users()
        pending_user = next((u for u in all_pending if u.get('id') == user_id), None)
    
    if not pending_user:
        return jsonify({'error': 'Pending user not found'}), 404
    
    # Now write to Google Sheets with approved status
    result = sheets_service.signup_user(
        username=pending_user.get('username'),
        email=pending_user.get('email'),
        password=pending_user.get('password'),  # Already hashed
        approval_status='approved'
    )
    
    if not result.get('success'):
        error = result.get('error', 'Failed to approve user')
        if 'already exists' in error.lower():
            # User might already exist in Sheets, try to update instead
            update_result = sheets_service.update_user(
                email=email,
                approval_status='approved'
            )
            if not update_result.get('success'):
                return jsonify({'error': 'User already exists but failed to update approval status'}), 500
        else:
            return jsonify({'error': error}), 500
    
    # Remove from pending users storage
    remove_pending_user(pending_user.get('email'))
    
    return jsonify({'message': 'User approved successfully and added to Google Sheets'})

@app.route('/api/admin/reject-user', methods=['POST'])
@admin_required
def reject_user(current_user):
    """Reject a pending user - remove from pending storage"""
    data = request.json
    email = data.get('email')
    user_id = data.get('user_id')
    
    if not email and not user_id:
        return jsonify({'error': 'Email or user_id is required'}), 400
    
    # Get pending user from local storage
    pending_user = None
    if email:
        pending_user = get_pending_user_by_email(email)
    elif user_id:
        all_pending = get_all_pending_users()
        pending_user = next((u for u in all_pending if u.get('id') == user_id), None)
    
    if not pending_user:
        return jsonify({'error': 'Pending user not found'}), 404
    
    # Remove from pending users storage (don't write to Google Sheets)
    if remove_pending_user(pending_user.get('email')):
        return jsonify({'message': 'User rejected successfully'})
    else:
        return jsonify({'error': 'Failed to reject user'}), 500

@app.route('/api/dashboard/admin', methods=['GET'])
@admin_required
def get_admin_dashboard(current_user):
    # Get all tasks
    all_tasks = sheets_service.get_all_tasks()
    
    # Calculate general stats
    total_tasks = len(all_tasks)
    pending_tasks = sum(1 for t in all_tasks if t.get('status', '').lower() == 'pending')
    in_progress_tasks = sum(1 for t in all_tasks if 'progress' in t.get('status', '').lower())
    completed_tasks = sum(1 for t in all_tasks if t.get('status', '').lower() == 'complete')
    
    # Overdue calculation
    overdue_tasks = 0
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    for task in all_tasks:
        deadline = task.get('deadline', '')
        status = task.get('status', '').lower()
        if deadline and deadline < today and status != 'complete':
            overdue_tasks += 1
    
    # User-wise stats
    user_stats = {}
    for task in all_tasks:
        user_id = task.get('user_id')
        if user_id not in user_stats:
            user_stats[user_id] = {
                'id': user_id,
                'username': f'User {user_id}',
                'email': '',
                'total_tasks': 0,
                'pending_tasks': 0,
                'in_progress_tasks': 0,
                'completed_tasks': 0,
                'overdue_tasks': 0
            }
        
        stats = user_stats[user_id]
        stats['total_tasks'] += 1
        status = task.get('status', '').lower()
        
        if status == 'pending':
            stats['pending_tasks'] += 1
        elif 'progress' in status:
            stats['in_progress_tasks'] += 1
        elif status == 'complete':
            stats['completed_tasks'] += 1
        
        deadline = task.get('deadline', '')
        if deadline and deadline < today and status != 'complete':
            stats['overdue_tasks'] += 1
    
    # Get all users from SignUp sheet (for task assignment dropdown)
    all_users = sheets_service.get_all_users()
    
    # Filter to only approved regular users (exclude admin and pending/rejected) for task assignment
    users_list = [
        {'id': user.get('id'), 'username': user.get('username'), 'email': user.get('email')}
        for user in all_users
        if user.get('role', 'user').lower() != 'admin' 
        and user.get('approval_status', 'approved').strip().lower() in ['approved', '']
    ]
    
    # Update user_stats with actual usernames from SignUp sheet
    user_lookup = {user.get('id'): user.get('username') for user in all_users}
    for user_stat in user_stats.values():
        user_id = user_stat['id']
        if user_id in user_lookup:
            user_stat['username'] = user_lookup[user_id]
            # Also get email if available
            user_info = next((u for u in all_users if u.get('id') == user_id), None)
            if user_info:
                user_stat['email'] = user_info.get('email', '')
    
    return jsonify({
        'generalStats': {
            'total_tasks': total_tasks,
            'pending_tasks': pending_tasks,
            'in_progress_tasks': in_progress_tasks,
            'completed_tasks': completed_tasks,
            'overdue_tasks': overdue_tasks
        },
        'userStats': list(user_stats.values()),
        'users': users_list
    })

# Serve frontend
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    if sheets_service.is_configured():
        print("Google Sheets integration configured!")
    else:
        print("WARNING: Google Sheets not configured. Set GOOGLE_SHEETS_WEB_APP_URL environment variable.")
    
    # Get port from environment (for production) or use 5000 for local
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '127.0.0.1')
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"Starting server on http://{host}:{port}")
    app.run(debug=debug, host='0.0.0.0', port=port)
