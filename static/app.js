// API Base URL
const API_BASE = '/api';

// Global state
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    authToken = localStorage.getItem('token');
    if (authToken) {
        getCurrentUser();
    } else {
        showPage('login-page');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Check Google Sheets configuration
    checkGoogleSheetsConfig();
});

async function checkGoogleSheetsConfig() {
    try {
        const response = await fetch('/api/config/status');
        const data = await response.json();
        
        if (!data.google_sheets_configured) {
            const warningDiv = document.getElementById('config-warning');
            if (warningDiv) {
                warningDiv.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error checking config:', error);
    }
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Page navigation
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('signup-page');
    });
    
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login-page');
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', authToken);
        
        // Debug logging
        console.log('Login successful. User data:', currentUser);
        
        if (!currentUser) {
            throw new Error('User data not received');
        }
        
        console.log('User role:', currentUser.role);
        console.log('User role type:', typeof currentUser.role);
        console.log('User role value:', JSON.stringify(currentUser.role));
        
        // Check role (case-insensitive, trimmed)
        const userRole = (currentUser.role || '').toString().trim().toLowerCase();
        console.log('Cleaned userRole:', userRole);
        console.log('userRole === "admin":', userRole === 'admin');
        
        if (userRole === 'admin') {
            console.log('✅ ADMIN DETECTED - Redirecting to admin dashboard');
            showAdminDashboard();
        } else {
            console.log('❌ NOT ADMIN - Redirecting to user dashboard. Role was:', userRole);
            showUserDashboard();
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        // Re-enable button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorDiv = document.getElementById('signup-error');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Clear previous errors and error styles
    errorDiv.style.display = 'none';
    passwordInput.classList.remove('error');
    confirmPasswordInput.classList.remove('error');
    
    // Validate password length
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long';
        errorDiv.style.display = 'block';
        passwordInput.classList.add('error');
        return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        passwordInput.classList.add('error');
        confirmPasswordInput.classList.add('error');
        return;
    }
    
    // Disable button and show loading state
    if (submitButton) {
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Signing up...';
    }
    
    try {
        const data = await apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        // Check if approval is required
        if (data.requires_approval) {
            errorDiv.style.background = '#d4edda';
            errorDiv.style.borderColor = '#c3e6cb';
            errorDiv.style.color = '#155724';
            errorDiv.textContent = data.message || 'Your account is pending admin approval. You will be able to login once approved.';
            errorDiv.style.display = 'block';
            
            // Clear form
            document.getElementById('signup-form').reset();
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                document.getElementById('show-login').click();
            }, 3000);
            return;
        }
        
        // If no approval needed (shouldn't happen with new system)
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', authToken);
        
        showUserDashboard();
    } catch (error) {
        errorDiv.style.background = '';
        errorDiv.style.borderColor = '';
        errorDiv.style.color = '';
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        // Re-enable button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
        }
    }
}

async function getCurrentUser() {
    try {
        const data = await apiCall('/auth/me');
        currentUser = data.user;
        
        if (!currentUser) {
            throw new Error('User data not received');
        }
        
        // Check role (case-insensitive, trimmed)
        const userRole = (currentUser.role || '').toString().trim().toLowerCase();
        if (userRole === 'admin') {
            showAdminDashboard();
        } else {
            showUserDashboard();
        }
    } catch (error) {
        logout();
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    showPage('login-page');
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('signup-error').style.display = 'none';
}

// Dashboard Functions
async function showAdminDashboard() {
    console.log('showAdminDashboard() called');
    console.log('currentUser:', currentUser);
    showPage('admin-dashboard');
    document.getElementById('admin-user-name').textContent = `Welcome, ${currentUser.username}`;
    await loadAdminDashboard();
}

async function showUserDashboard() {
    showPage('user-dashboard');
    document.getElementById('user-name').textContent = `Welcome, ${currentUser.username}`;
    await loadUserDashboard();
}

async function loadAdminDashboard() {
    try {
        // Load pending users first
        await loadPendingUsers();
        
        const data = await apiCall('/dashboard/admin');
        
        // Load general stats
        const statsHtml = `
            <div class="stat-card">
                <h3>Total Tasks</h3>
                <p class="stat-number">${data.generalStats.total_tasks || 0}</p>
            </div>
            <div class="stat-card pending">
                <h3>Pending</h3>
                <p class="stat-number">${data.generalStats.pending_tasks || 0}</p>
            </div>
            <div class="stat-card in-progress">
                <h3>In Progress</h3>
                <p class="stat-number">${data.generalStats.in_progress_tasks || 0}</p>
            </div>
            <div class="stat-card completed">
                <h3>Completed</h3>
                <p class="stat-number">${data.generalStats.completed_tasks || 0}</p>
            </div>
            <div class="stat-card overdue">
                <h3>Overdue</h3>
                <p class="stat-number">${data.generalStats.overdue_tasks || 0}</p>
            </div>
        `;
        document.getElementById('admin-general-stats').innerHTML = statsHtml;
        
        // Load user stats table
        const userStatsBody = document.getElementById('user-stats-body');
        if (data.userStats.length === 0) {
            userStatsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
        } else {
            userStatsBody.innerHTML = data.userStats.map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.total_tasks || 0}</td>
                    <td>${user.pending_tasks || 0}</td>
                    <td>${user.in_progress_tasks || 0}</td>
                    <td>${user.completed_tasks || 0}</td>
                    <td class="${user.overdue_tasks > 0 ? 'overdue-cell' : ''}">${user.overdue_tasks || 0}</td>
                </tr>
            `).join('');
        }
        
        // Load users for task assignment
        const userSelect = document.getElementById('task-assigned-to');
        userSelect.innerHTML = '<option value="">Select User</option>' + 
            data.users.map(user => `<option value="${user.id}">${user.username}</option>`).join('');
        
        // Load tasks
        await loadAdminTasks();
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        alert('Error loading dashboard: ' + error.message);
    }
}

async function loadUserDashboard() {
    try {
        const data = await apiCall('/dashboard/user');
        
        // Load stats
        const statsHtml = `
            <div class="stat-card">
                <h3>Total Tasks</h3>
                <p class="stat-number">${data.stats.total_tasks || 0}</p>
            </div>
            <div class="stat-card pending">
                <h3>Pending</h3>
                <p class="stat-number">${data.stats.pending_tasks || 0}</p>
            </div>
            <div class="stat-card in-progress">
                <h3>In Progress</h3>
                <p class="stat-number">${data.stats.in_progress_tasks || 0}</p>
            </div>
            <div class="stat-card completed">
                <h3>Completed</h3>
                <p class="stat-number">${data.stats.completed_tasks || 0}</p>
            </div>
            <div class="stat-card overdue">
                <h3>Overdue</h3>
                <p class="stat-number">${data.stats.overdue_tasks || 0}</p>
            </div>
        `;
        document.getElementById('user-stats').innerHTML = statsHtml;
        
        // Load tasks
        await loadUserTasks();
    } catch (error) {
        console.error('Error loading user dashboard:', error);
        alert('Error loading dashboard: ' + error.message);
    }
}

async function loadAdminTasks() {
    try {
        const tasks = await apiCall('/tasks');
        const tasksList = document.getElementById('admin-tasks-list');
        
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        tasksList.innerHTML = tasks.map(task => {
            const deadline = task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline';
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
            
            return `
                <div class="task-card ${isOverdue ? 'overdue' : ''}">
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <select 
                            class="status-select status-${task.status}" 
                            onchange="updateTaskStatus(${task.id}, this.value)"
                        >
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                    <p class="task-description">${task.description || 'No description'}</p>
                    <div class="task-footer">
                        <span><strong>Assigned to:</strong> ${task.assigned_to_name || 'Unassigned'}</span>
                        <span><strong>Deadline:</strong> ${deadline}</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function loadUserTasks() {
    try {
        const tasks = await apiCall('/tasks');
        const tasksList = document.getElementById('user-tasks-list');
        
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p class="no-tasks">No tasks assigned yet</p>';
            return;
        }
        
        tasksList.innerHTML = tasks.map(task => {
            const deadline = task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline';
            // Check status case-insensitively (could be 'completed', 'complete', 'COMPLETED', etc.)
            const taskStatus = (task.status || '').toLowerCase().trim();
            const isCompleted = taskStatus === 'completed' || taskStatus === 'complete';
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !isCompleted;
            const displayStatus = isCompleted ? 'Completed' : 'In Progress';
            
            return `
                <div class="task-card ${isOverdue ? 'overdue' : ''}">
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <div class="task-status-section">
                            <span class="status-badge ${isCompleted ? 'status-completed' : 'status-in_progress'}">${displayStatus}</span>
                            ${!isCompleted ? `<button onclick="updateTaskStatus(${task.id}, 'completed')" class="mark-completed-button">Mark as Completed</button>` : ''}
                        </div>
                    </div>
                    <p class="task-description">${task.description || 'No description'}</p>
                    <div class="task-footer">
                        <span><strong>Deadline:</strong> ${deadline}</span>
                        <span><strong>Assigned by:</strong> ${task.assigned_by_name || 'Admin'}</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function updateTaskStatus(taskId, newStatus) {
    // Find the button and disable it, show loading state
    const button = document.querySelector(`button[onclick*="updateTaskStatus(${taskId}"]`);
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="button-spinner"></span> Updating...';
    }
    
    try {
        await apiCall(`/tasks/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
        
        // Reload tasks and dashboard immediately - wait for both to complete
        // Only regular users can update task status (admin cannot)
        if (currentUser && currentUser.role === 'admin') {
            await Promise.all([
                loadAdminTasks(),
                loadAdminDashboard()
            ]);
        } else {
            await Promise.all([
                loadUserTasks(),
                loadUserDashboard()
            ]);
        }
    } catch (error) {
        alert('Error updating task status: ' + error.message);
        // Reload to ensure consistency
        if (currentUser && currentUser.role === 'admin') {
            await Promise.all([
                loadAdminTasks(),
                loadAdminDashboard()
            ]);
        } else {
            await Promise.all([
                loadUserTasks(),
                loadUserDashboard()
            ]);
        }
    }
    // Button will be replaced when tasks reload
}

function toggleTaskForm() {
    const form = document.getElementById('task-form');
    const button = document.getElementById('task-form-toggle');
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        button.textContent = 'Cancel';
    } else {
        form.style.display = 'none';
        button.textContent = '+ Create New Task';
        form.reset();
    }
}

async function createTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const assignedTo = document.getElementById('task-assigned-to').value;
    const deadline = document.getElementById('task-deadline').value;
    
    try {
        await apiCall('/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                assigned_to: parseInt(assignedTo),
                deadline: deadline || null
            })
        });
        
        document.getElementById('task-form').reset();
        toggleTaskForm();
        await loadAdminTasks();
        await loadAdminDashboard();
    } catch (error) {
        alert('Error creating task: ' + error.message);
    }
}

// Pending Users Functions
async function loadPendingUsers() {
    try {
        const data = await apiCall('/admin/pending-users');
        const pendingUsers = data.users || [];
        const section = document.getElementById('pending-users-section');
        const countSpan = document.getElementById('pending-users-count');
        const listDiv = document.getElementById('pending-users-list');
        
        if (!section || !countSpan || !listDiv) {
            console.error('Pending users section elements not found in HTML');
            return;
        }
        
        countSpan.textContent = pendingUsers.length;
        
        if (pendingUsers.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        // Show section
        section.style.display = 'block';
        
        // Build users table
        listDiv.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #fff; border-bottom: 2px solid #ddd;">
                        <th style="padding: 10px; text-align: left;">Username</th>
                        <th style="padding: 10px; text-align: left;">Email</th>
                        <th style="padding: 10px; text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${pendingUsers.map(user => `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px;">${user.username || 'N/A'}</td>
                            <td style="padding: 10px;">${user.email || 'N/A'}</td>
                            <td style="padding: 10px; text-align: center;">
                                <button onclick="approveUser('${user.email}', ${user.id || 'null'})" 
                                        style="padding: 6px 12px; margin-right: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    Approve
                                </button>
                                <button onclick="rejectUser('${user.email}', ${user.id || 'null'})" 
                                        style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading pending users:', error);
        // Hide section on error
        const section = document.getElementById('pending-users-section');
        if (section) section.style.display = 'none';
    }
}

function togglePendingUsers() {
    const content = document.getElementById('pending-users-content');
    const toggleText = document.getElementById('pending-users-toggle-text');
    
    if (!content || !toggleText) return;
    
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    toggleText.textContent = isHidden ? 'Hide' : 'Show';
}

async function approveUser(email, userId) {
    if (!confirm(`Approve user: ${email}?`)) return;
    
    try {
        await apiCall('/admin/approve-user', {
            method: 'POST',
            body: JSON.stringify({ email, user_id: userId })
        });
        alert('User approved successfully!');
        await loadPendingUsers();
        await loadAdminDashboard(); // Refresh to show in task assignment
    } catch (error) {
        alert('Error approving user: ' + error.message);
    }
}

async function rejectUser(email, userId) {
    if (!confirm(`Reject user: ${email}? This action cannot be undone.`)) return;
    
    try {
        await apiCall('/admin/reject-user', {
            method: 'POST',
            body: JSON.stringify({ email, user_id: userId })
        });
        alert('User rejected successfully!');
        await loadPendingUsers();
    } catch (error) {
        alert('Error rejecting user: ' + error.message);
    }
}

