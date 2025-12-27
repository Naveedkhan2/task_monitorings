const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(DB_PATH);

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) reject(err);
      });

      // Tasks table
      db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        assigned_to INTEGER,
        assigned_by INTEGER,
        status TEXT DEFAULT 'pending',
        deadline DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users(id),
        FOREIGN KEY (assigned_by) REFERENCES users(id)
      )`, (err) => {
        if (err) reject(err);
      });

      // Task assignments table (many-to-many relationship)
      db.run(`CREATE TABLE IF NOT EXISTS task_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(task_id, user_id)
      )`, (err) => {
        if (err) reject(err);
      });

      // Performance tracking table
      db.run(`CREATE TABLE IF NOT EXISTS performance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_id INTEGER,
        completed_tasks INTEGER DEFAULT 0,
        pending_tasks INTEGER DEFAULT 0,
        overdue_tasks INTEGER DEFAULT 0,
        record_date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      )`, (err) => {
        if (err) reject(err);
      });

      // Create default admin user
      const defaultPassword = bcrypt.hashSync('R1s2h3h4', 10);
      db.run(`INSERT OR IGNORE INTO users (username, email, password, role) 
              VALUES (?, ?, ?, ?)`,
        ['admin', 'epsilonsystem25@gmail.com', defaultPassword, 'admin'],
        (err) => {
          if (err) reject(err);
          else {
            console.log('Database initialized successfully');
            resolve();
          }
        }
      );
    });
  });
};

const getDb = () => db;

module.exports = { initDatabase, getDb };

