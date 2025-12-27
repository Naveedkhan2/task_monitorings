import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../epsilon logo.png';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/user');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleMarkCompleted = async (taskId) => {
    setUpdatingTaskId(taskId);
    
    try {
      // Update task status in backend
      await axios.patch(`/api/tasks/${taskId}/status`, { status: 'completed' });
      
      // Refresh both tasks and dashboard data immediately
      await Promise.all([
        fetchTasks(),
        fetchDashboardData()
      ]);
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating task');
      // Reload data on error to ensure consistency
      await Promise.all([
        fetchTasks(),
        fetchDashboardData()
      ]);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="loading">Error loading dashboard</div>;
  }

  const { stats, recentTasks } = dashboardData;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo-title">
          <img src={logo} alt="EPSILON SMART SOLUTIONS" className="header-logo" />
          <h1>My Dashboard</h1>
        </div>
        <div className="header-actions">
          <span className="user-name">Welcome, {user?.username}</span>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="admin-link-button">
              Admin Panel
            </button>
          )}
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* My Stats */}
        <section className="stats-section">
          <h2>My Performance Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p className="stat-number">{stats.total_tasks}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending</h3>
              <p className="stat-number">{stats.pending_tasks}</p>
            </div>
            <div className="stat-card in-progress">
              <h3>In Progress</h3>
              <p className="stat-number">{stats.in_progress_tasks}</p>
            </div>
            <div className="stat-card completed">
              <h3>Completed</h3>
              <p className="stat-number">{stats.completed_tasks}</p>
            </div>
            <div className="stat-card overdue">
              <h3>Overdue</h3>
              <p className="stat-number">{stats.overdue_tasks}</p>
            </div>
          </div>
        </section>

        {/* My Tasks */}
        <section className="tasks-section">
          <h2>My Tasks</h2>
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="no-tasks">No tasks assigned yet</p>
            ) : (
              tasks.map((task) => {
                // Check status case-insensitively (could be 'completed', 'Complete', 'COMPLETED', etc.)
                const taskStatus = (task.status || '').toLowerCase().trim();
                const isCompleted = taskStatus === 'completed' || taskStatus === 'complete';
                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !isCompleted;
                const displayStatus = isCompleted ? 'Completed' : 'In Progress';
                
                return (
                  <div key={task.id} className={`task-card ${isOverdue ? 'overdue' : ''}`}>
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <div className="task-status-section">
                        <span className={`status-badge ${isCompleted ? 'status-completed' : 'status-in_progress'}`}>
                          {displayStatus}
                        </span>
                        {!isCompleted && (
                          <button
                            onClick={() => handleMarkCompleted(task.id)}
                            className="mark-completed-button"
                            disabled={updatingTaskId === task.id}
                          >
                            {updatingTaskId === task.id ? (
                              <>
                                <span className="button-spinner"></span>
                                Updating...
                              </>
                            ) : (
                              'Mark as Completed'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-footer">
                      <span><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline'}</span>
                      <span><strong>Assigned by:</strong> {task.assigned_by_name}</span>
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

export default UserDashboard;

