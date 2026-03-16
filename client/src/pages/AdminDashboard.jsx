import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import logo from '../epsilon logo.png';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: [], // Changed to array for multiple users
    deadline: ''
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showPendingUsers, setShowPendingUsers] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [dateFilter]);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('/api/admin/pending-users');
      console.log('Pending users response:', response.data);
      setPendingUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array on error to avoid breaking the UI
      setPendingUsers([]);
    }
  };

  const handleApproveUser = async (email, userId) => {
    try {
      await axios.post('/api/admin/approve-user', { email, user_id: userId });
      alert('User approved successfully!');
      fetchPendingUsers();
      fetchDashboardData(); // Refresh to show new user in task assignment dropdown
    } catch (error) {
      alert(error.response?.data?.error || 'Error approving user');
    }
  };

  const handleRejectUser = async (email, userId) => {
    if (!window.confirm('Are you sure you want to reject this user?')) {
      return;
    }
    try {
      await axios.post('/api/admin/reject-user', { email, user_id: userId });
      alert('User rejected successfully!');
      fetchPendingUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error rejecting user');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/admin');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (dateFilter.startDate) {
        params.append('startDate', dateFilter.startDate);
      }
      if (dateFilter.endDate) {
        params.append('endDate', dateFilter.endDate);
      }
      const response = await axios.get(`/api/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', taskForm);
      setShowTaskForm(false);
      setTaskForm({ title: '', description: '', assigned_to: [], deadline: '' });
      fetchTasks();
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating task');
    }
  };

  // Removed handleStatusChange - admin can only view status, not update it

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="loading">Error loading dashboard</div>;
  }

  const { generalStats, userStats, users } = dashboardData;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo-title">
          <img src={logo} alt="EPSILON SMART SOLUTIONS" className="header-logo" />
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-actions">
          <span className="user-name">Welcome, {user?.username}</span>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* General Performance Overview */}
        <section className="stats-section">
          <h2>General Performance Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p className="stat-number">{generalStats.total_tasks}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending</h3>
              <p className="stat-number">{generalStats.pending_tasks}</p>
            </div>
            <div className="stat-card in-progress">
              <h3>In Progress</h3>
              <p className="stat-number">{generalStats.in_progress_tasks}</p>
            </div>
            <div className="stat-card completed">
              <h3>Completed</h3>
              <p className="stat-number">{generalStats.completed_tasks}</p>
            </div>
            <div className="stat-card overdue">
              <h3>Overdue</h3>
              <p className="stat-number">{generalStats.overdue_tasks}</p>
            </div>
          </div>
        </section>

        {/* Pending Users Section - Always show, even if empty */}
        <section className="pending-users-section" style={{ marginBottom: '30px', padding: '20px', background: pendingUsers.length > 0 ? '#fff3cd' : '#e9ecef', borderRadius: '8px', border: `1px solid ${pendingUsers.length > 0 ? '#ffc107' : '#dee2e6'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, color: pendingUsers.length > 0 ? '#856404' : '#495057' }}>
              Pending User Approvals {pendingUsers.length > 0 ? `(${pendingUsers.length})` : '(0)'}
            </h2>
            {pendingUsers.length > 0 && (
              <button 
                onClick={() => setShowPendingUsers(!showPendingUsers)}
                className="primary-button"
                style={{ background: '#ffc107', color: '#000' }}
              >
                {showPendingUsers ? 'Hide' : 'Show'} Pending Users
              </button>
            )}
          </div>
          {pendingUsers.length === 0 ? (
            <p style={{ margin: 0, color: '#6c757d', fontStyle: 'italic' }}>
              No users pending approval at this time.
            </p>
          ) : showPendingUsers && (
              <div className="pending-users-list">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fff', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user.id || user.email} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{user.username}</td>
                        <td style={{ padding: '10px' }}>{user.email}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleApproveUser(user.email, user.id)}
                            style={{ 
                              padding: '6px 12px', 
                              marginRight: '8px', 
                              background: '#28a745', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer' 
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(user.email, user.id)}
                            style={{ 
                              padding: '6px 12px', 
                              background: '#dc3545', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: 'pointer' 
                            }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* User-wise Performance */}
        <section className="user-performance-section">
          <h2>User-wise Performance</h2>
          <div className="user-stats-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Total Tasks</th>
                  <th>Pending</th>
                  <th>In Progress</th>
                  <th>Completed</th>
                  <th>Overdue</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((userStat) => (
                  <tr key={userStat.id}>
                    <td>{userStat.username}</td>
                    <td>{userStat.total_tasks}</td>
                    <td>{userStat.pending_tasks}</td>
                    <td>{userStat.in_progress_tasks}</td>
                    <td>{userStat.completed_tasks}</td>
                    <td className={userStat.overdue_tasks > 0 ? 'overdue-cell' : ''}>
                      {userStat.overdue_tasks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Task Management */}
        <section className="tasks-section">
          <div className="section-header">
            <h2>Task Management</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                  placeholder="Start Date"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                  placeholder="End Date"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <button
                    onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer' }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <button onClick={() => setShowTaskForm(!showTaskForm)} className="primary-button">
                {showTaskForm ? 'Cancel' : '+ Create New Task'}
              </button>
            </div>
          </div>

          {showTaskForm && (
            <form onSubmit={handleCreateTask} className="task-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assign To * (Select multiple users)</label>
                  <select
                    multiple
                    value={taskForm.assigned_to}
                    onChange={(e) => {
                      const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
                      setTaskForm({ ...taskForm, assigned_to: selectedUsers });
                    }}
                    required
                    style={{ minHeight: '100px' }}
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                  <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple users
                  </small>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="datetime-local"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="primary-button">Create Task</button>
            </form>
          )}

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="no-tasks">No tasks found</p>
            ) : (
              tasks.map((task) => {
                // Check if task is overdue (deadline passed and not completed)
                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
                const assignedUsers = task.assigned_to_names || (task.assigned_to_name ? task.assigned_to_name.split(', ') : []);
                
                return (
                  <div key={task.id} className={`task-card ${isOverdue ? 'overdue' : ''}`}>
                    {/* Task Description - Main Focus */}
                    <div className="task-description-section">
                      <h3 className="task-title">{task.title || 'Untitled Task'}</h3>
                      <div className="task-description-text">
                        {task.description ? (
                          <p>{task.description}</p>
                        ) : (
                          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No description provided</p>
                        )}
                      </div>
                    </div>

                    {/* Assigned Persons Section */}
                    <div className="task-assigned-section">
                      <div className="assigned-label">
                        <strong>Assigned To:</strong>
                      </div>
                      <div className="assigned-users-list">
                        {assignedUsers.length > 0 ? (
                          assignedUsers.map((userName, index) => (
                            <span key={index} className="user-badge">
                              {userName.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="user-badge unassigned">Unassigned</span>
                        )}
                      </div>
                    </div>

                    {/* Task Details Footer */}
                    <div className="task-details-footer">
                      <div className="task-detail-item">
                        <span className="detail-label">Status:</span>
                        <div style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '500',
                          backgroundColor: task.status === 'completed' ? '#10b981' : task.status === 'in_progress' ? '#3b82f6' : '#f59e0b',
                          color: 'white',
                          cursor: 'default',
                          userSelect: 'none',
                          display: 'inline-block',
                          pointerEvents: 'none',
                          border: 'none',
                          outline: 'none'
                        }} title="Admin cannot change task status. Only assigned users can update status.">
                          {task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                        </div>
                      </div>
                      <div className="task-detail-item">
                        <span className="detail-label">Deadline:</span>
                        <span className="detail-value">
                          {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline'}
                        </span>
                      </div>
                      {isOverdue && (
                        <div className="task-detail-item overdue-badge">
                          <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '14px' }}>⚠️ Overdue</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;

