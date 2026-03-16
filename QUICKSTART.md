# Quick Start Guide

## Installation Steps

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
   
   This will install dependencies for both the backend and frontend.

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   This starts both the backend (port 5000) and frontend (port 3000) servers.

## Access the Application

- **Frontend**: Open your browser and go to `http://localhost:3000`
- **Backend API**: Available at `http://localhost:5000/api`

## Default Login Credentials

**Admin Account:**
- Email: `admin@taskmonitor.com`
- Password: `admin123`

## First Steps

1. **Login as Admin:**
   - Use the admin credentials above
   - You'll be redirected to the Admin Dashboard

2. **Create a User Account:**
   - Click "Logout" 
   - Click "Sign up" to create a new user account
   - Login with the new user account to see the User Dashboard

3. **As Admin:**
   - View general performance metrics
   - View user-wise performance
   - Create tasks and assign them to users
   - Set deadlines for tasks

4. **As User:**
   - View your assigned tasks
   - Update task status (Pending → In Progress → Completed)
   - View your personal dashboard with performance metrics

## Troubleshooting

- If you get port errors, make sure ports 3000 and 5000 are not in use
- If the database doesn't work, delete `server/database/database.sqlite` and restart
- Make sure Node.js (v14+) is installed

