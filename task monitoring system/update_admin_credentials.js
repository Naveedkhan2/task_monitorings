const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'server/database/database.sqlite');

const db = new sqlite3.Database(DB_PATH);

// Update admin credentials
const newPassword = bcrypt.hashSync('R1s2h3h4', 10);
const newEmail = 'epsilonsystem25@gmail.com';
const newUsername = 'admin';

db.serialize(() => {
  // First, try to update existing admin user
  db.run(
    `UPDATE users 
     SET email = ?, password = ?, username = ?
     WHERE role = 'admin' OR email = 'admin@taskmonitor.com' OR email = ?`,
    [newEmail, newPassword, newUsername, newEmail],
    function(err) {
      if (err) {
        console.error('Error updating admin:', err);
        return;
      }
      
      if (this.changes > 0) {
        console.log(`✓ Updated ${this.changes} admin user(s) with new credentials`);
      } else {
        // If no admin found, create one
        db.run(
          `INSERT INTO users (username, email, password, role) 
           VALUES (?, ?, ?, ?)`,
          [newUsername, newEmail, newPassword, 'admin'],
          function(err) {
            if (err) {
              console.error('Error creating admin:', err);
            } else {
              console.log('✓ Created new admin user with credentials');
            }
            db.close();
          }
        );
      }
    }
  );
  
  // Wait a bit then close
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('\n✓ Admin credentials updated successfully!');
        console.log('\nNew Admin Credentials:');
        console.log('Email: epsilonsystem25@gmail.com');
        console.log('Password: R1s2h3h4');
        console.log('\nYou can now login with these credentials.');
      }
    });
  }, 500);
});

