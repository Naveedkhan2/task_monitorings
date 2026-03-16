const express = require('express');
const { getDb } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all tasks (admin sees all, users see only their tasks)
router.get('/', (req, res) => {
  const db = getDb();
  const { startDate, endDate } = req.query;
  
  let dateFilter = '';
  let dateParams = [];
  
  if (startDate || endDate) {
    const conditions = [];
    if (startDate) {
      conditions.push('t.created_at >= ?');
      dateParams.push(startDate);
    }
    if (endDate) {
      conditions.push('t.created_at <= ?');
      dateParams.push(endDate + ' 23:59:59');
    }
    dateFilter = 'WHERE ' + conditions.join(' AND ');
  }
  
  if (req.user.role === 'admin') {
    db.all(
      `SELECT t.*, 
              u2.username as assigned_by_name
       FROM tasks t
       LEFT JOIN users u2 ON t.assigned_by = u2.id
       ${dateFilter}
       ORDER BY t.created_at DESC`,
      dateParams,
      (err, tasks) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Get assigned users for each task
        const taskIds = tasks.map(t => t.id);
        if (taskIds.length === 0) {
          return res.json([]);
        }
        
        const placeholders = taskIds.map(() => '?').join(',');
        db.all(
          `SELECT ta.task_id, u.username, u.id as user_id
           FROM task_assignments ta
           JOIN users u ON ta.user_id = u.id
           WHERE ta.task_id IN (${placeholders})`,
          taskIds,
          (err, assignments) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            
            // Group assignments by task_id
            const assignmentsByTask = {};
            assignments.forEach(a => {
              if (!assignmentsByTask[a.task_id]) {
                assignmentsByTask[a.task_id] = [];
              }
              assignmentsByTask[a.task_id].push(a.username);
            });
            
            // Add assigned users to tasks
            const tasksWithUsers = tasks.map(task => ({
              ...task,
              assigned_to_names: assignmentsByTask[task.id] || [],
              assigned_to_name: assignmentsByTask[task.id] ? assignmentsByTask[task.id].join(', ') : 'Unassigned'
            }));
            
            res.json(tasksWithUsers);
          }
        );
      }
    );
  } else {
    const userFilter = dateFilter ? 'AND' : 'WHERE';
    db.all(
      `SELECT DISTINCT t.*, 
              u2.username as assigned_by_name
       FROM tasks t
       LEFT JOIN users u2 ON t.assigned_by = u2.id
       JOIN task_assignments ta ON t.id = ta.task_id
       ${dateFilter} ${userFilter} ta.user_id = ?
       ORDER BY t.created_at DESC`,
      [...dateParams, req.user.id],
      (err, tasks) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Get assigned users for each task
        const taskIds = tasks.map(t => t.id);
        if (taskIds.length === 0) {
          return res.json([]);
        }
        
        const placeholders = taskIds.map(() => '?').join(',');
        db.all(
          `SELECT ta.task_id, u.username, u.id as user_id
           FROM task_assignments ta
           JOIN users u ON ta.user_id = u.id
           WHERE ta.task_id IN (${placeholders})`,
          taskIds,
          (err, assignments) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            
            // Group assignments by task_id
            const assignmentsByTask = {};
            assignments.forEach(a => {
              if (!assignmentsByTask[a.task_id]) {
                assignmentsByTask[a.task_id] = [];
              }
              assignmentsByTask[a.task_id].push(a.username);
            });
            
            // Add assigned users to tasks
            const tasksWithUsers = tasks.map(task => ({
              ...task,
              assigned_to_names: assignmentsByTask[task.id] || [],
              assigned_to_name: assignmentsByTask[task.id] ? assignmentsByTask[task.id].join(', ') : 'Unassigned'
            }));
            
            res.json(tasksWithUsers);
          }
        );
      }
    );
  }
});

// Get single task
router.get('/:id', (req, res) => {
  const db = getDb();
  
  db.get(
    `SELECT t.*, u2.username as assigned_by_name
     FROM tasks t
     LEFT JOIN users u2 ON t.assigned_by = u2.id
     WHERE t.id = ?`,
    [req.params.id],
    (err, task) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user has access to this task (either admin or assigned to task)
      if (req.user.role !== 'admin') {
        db.get(
          'SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?',
          [req.params.id, req.user.id],
          (err, assignment) => {
            if (err || !assignment) {
              return res.status(403).json({ error: 'Access denied' });
            }
            
            // Get assigned users
            db.all(
              `SELECT u.username, u.id as user_id
               FROM task_assignments ta
               JOIN users u ON ta.user_id = u.id
               WHERE ta.task_id = ?`,
              [req.params.id],
              (err, assignments) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                
                const assignedNames = assignments.map(a => a.username);
                res.json({
                  ...task,
                  assigned_to_names: assignedNames,
                  assigned_to_name: assignedNames.join(', ')
                });
              }
            );
          }
        );
        return;
      }
      
      // Admin can see all tasks - get assigned users
      db.all(
        `SELECT u.username, u.id as user_id
         FROM task_assignments ta
         JOIN users u ON ta.user_id = u.id
         WHERE ta.task_id = ?`,
        [req.params.id],
        (err, assignments) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          const assignedNames = assignments.map(a => a.username);
          res.json({
            ...task,
            assigned_to_names: assignedNames,
            assigned_to_name: assignedNames.join(', ')
          });
        }
      );
    }
  );
});

// Create task (admin only)
router.post('/', requireAdmin, (req, res) => {
  const { title, description, assigned_to, deadline } = req.body;

  if (!title || !assigned_to || !Array.isArray(assigned_to) || assigned_to.length === 0) {
    return res.status(400).json({ error: 'Title and at least one assigned user are required' });
  }

  const db = getDb();
  
  db.run(
    `INSERT INTO tasks (title, description, assigned_by, deadline, status)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description || '', req.user.id, deadline || null, 'pending'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating task' });
      }

      const taskId = this.lastID;
      
      // Insert task assignments for multiple users
      const assignmentPromises = assigned_to.map(userId => {
        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)`,
            [taskId, userId],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      });
      
      Promise.all(assignmentPromises)
        .then(() => {
          // Get task with assigned users
          db.all(
            `SELECT ta.task_id, u.username
             FROM task_assignments ta
             JOIN users u ON ta.user_id = u.id
             WHERE ta.task_id = ?`,
            [taskId],
            (err, assignments) => {
              if (err) {
                return res.status(500).json({ error: 'Error fetching task assignments' });
              }
              
              db.get(
                `SELECT t.*, u2.username as assigned_by_name
                 FROM tasks t
                 LEFT JOIN users u2 ON t.assigned_by = u2.id
                 WHERE t.id = ?`,
                [taskId],
                (err, task) => {
                  if (err) {
                    return res.status(500).json({ error: 'Error fetching task' });
                  }
                  
                  const assignedNames = assignments.map(a => a.username);
                  res.status(201).json({
                    ...task,
                    assigned_to_names: assignedNames,
                    assigned_to_name: assignedNames.join(', ')
                  });
                }
              );
            }
          );
        })
        .catch((err) => {
          return res.status(500).json({ error: 'Error creating task assignments' });
        });
    }
  );
});

// Update task status (users can update their own assigned tasks, admin cannot update status)
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  const db = getDb();
  
  // First check if user has access to this task
  db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to this task (either admin or assigned to task)
    if (req.user.role !== 'admin') {
      db.get(
        'SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        (err, assignment) => {
          if (err || !assignment) {
            return res.status(403).json({ error: 'Access denied' });
          }
          
          // User can update status of their assigned tasks
          db.run(
            'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Error updating task' });
              }
              
              db.get(
                `SELECT t.*, u2.username as assigned_by_name
                 FROM tasks t
                 LEFT JOIN users u2 ON t.assigned_by = u2.id
                 WHERE t.id = ?`,
                [req.params.id],
                (err, updatedTask) => {
                  if (err) {
                    return res.status(500).json({ error: 'Error fetching updated task' });
                  }
                  
                  // Get assigned users
                  db.all(
                    `SELECT u.username
                     FROM task_assignments ta
                     JOIN users u ON ta.user_id = u.id
                     WHERE ta.task_id = ?`,
                    [req.params.id],
                    (err, assignments) => {
                      if (err) {
                        return res.status(500).json({ error: 'Database error' });
                      }
                      
                      const assignedNames = assignments.map(a => a.username);
                      res.json({
                        ...updatedTask,
                        assigned_to_names: assignedNames,
                        assigned_to_name: assignedNames.join(', ')
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
      return;
    }
    
    // Admin cannot update status - return error
    return res.status(403).json({ error: 'Admin cannot update task status. Only assigned users can update status.' });
  });
});

// Update task (admin only) - Admin cannot update status
router.put('/:id', requireAdmin, (req, res) => {
  const { title, description, assigned_to, deadline } = req.body;
  // Note: status is intentionally excluded - admin cannot change task status

  const db = getDb();
  
  // First check if task exists
  db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task (excluding status - admin cannot change status)
    db.run(
      `UPDATE tasks 
       SET title = ?, description = ?, deadline = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title || task.title, description !== undefined ? description : task.description, deadline || task.deadline, req.params.id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating task' });
        }
        
        // Update task assignments if assigned_to is provided
        if (assigned_to && Array.isArray(assigned_to) && assigned_to.length > 0) {
          // Delete existing assignments
          db.run('DELETE FROM task_assignments WHERE task_id = ?', [req.params.id], (err) => {
            if (err) {
              return res.status(500).json({ error: 'Error updating task assignments' });
            }
            
            // Insert new assignments
            const assignmentPromises = assigned_to.map(userId => {
              return new Promise((resolve, reject) => {
                db.run(
                  `INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)`,
                  [req.params.id, userId],
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              });
            });
            
            Promise.all(assignmentPromises)
              .then(() => {
                // Get updated task with assigned users
                fetchTaskWithAssignments(req.params.id, res);
              })
              .catch((err) => {
                return res.status(500).json({ error: 'Error creating task assignments' });
              });
          });
        } else {
          // No assignment changes, just return updated task
          fetchTaskWithAssignments(req.params.id, res);
        }
      }
    );
  });
  
  // Helper function to fetch task with assignments
  function fetchTaskWithAssignments(taskId, res) {
    const db = getDb();
    db.get(
      `SELECT t.*, u2.username as assigned_by_name
       FROM tasks t
       LEFT JOIN users u2 ON t.assigned_by = u2.id
       WHERE t.id = ?`,
      [taskId],
      (err, task) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching task' });
        }
        
        // Get assigned users
        db.all(
          `SELECT u.username, u.id as user_id
           FROM task_assignments ta
           JOIN users u ON ta.user_id = u.id
           WHERE ta.task_id = ?`,
          [taskId],
          (err, assignments) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            
            const assignedNames = assignments.map(a => a.username);
            res.json({
              ...task,
              assigned_to_names: assignedNames,
              assigned_to_name: assignedNames.join(', ')
            });
          }
        );
      }
    );
  }
});

// Delete task (admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting task' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;

