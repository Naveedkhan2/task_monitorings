const express = require('express');
const { getDb } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Get user dashboard stats
router.get('/user', (req, res) => {
  const db = getDb();
  const userId = req.user.id;

  db.all(
    `SELECT 
      COUNT(DISTINCT t.id) as total_tasks,
      SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
      SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
      SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
      SUM(CASE WHEN t.deadline < datetime('now') AND t.status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
     FROM tasks t
     JOIN task_assignments ta ON t.id = ta.task_id
     WHERE ta.user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get recent tasks
      db.all(
        `SELECT DISTINCT t.* FROM tasks t
         JOIN task_assignments ta ON t.id = ta.task_id
         WHERE ta.user_id = ? 
         ORDER BY t.created_at DESC 
         LIMIT 5`,
        [userId],
        (err, recentTasks) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({
            stats: stats[0] || {
              total_tasks: 0,
              pending_tasks: 0,
              in_progress_tasks: 0,
              completed_tasks: 0,
              overdue_tasks: 0
            },
            recentTasks
          });
        }
      );
    }
  );
});

// Get admin dashboard stats
router.get('/admin', requireAdmin, (req, res) => {
  const db = getDb();

  // General stats
  db.all(
    `SELECT 
      COUNT(*) as total_tasks,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
      SUM(CASE WHEN deadline < datetime('now') AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
     FROM tasks`,
    [],
    (err, generalStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // User-wise stats
      db.all(
        `SELECT 
          u.id,
          u.username,
          u.email,
          COUNT(DISTINCT t.id) as total_tasks,
          SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
          SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
          SUM(CASE WHEN t.deadline < datetime('now') AND t.status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
         FROM users u
         LEFT JOIN task_assignments ta ON u.id = ta.user_id
         LEFT JOIN tasks t ON ta.task_id = t.id
         WHERE u.role = 'user'
         GROUP BY u.id, u.username, u.email
         ORDER BY u.username`,
        [],
        (err, userStats) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          // Get all users for task assignment
          db.all(
            'SELECT id, username, email FROM users WHERE role = ?',
            ['user'],
            (err, users) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              res.json({
                generalStats: generalStats[0] || {
                  total_tasks: 0,
                  pending_tasks: 0,
                  in_progress_tasks: 0,
                  completed_tasks: 0,
                  overdue_tasks: 0
                },
                userStats,
                users
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;

