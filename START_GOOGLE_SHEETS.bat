@echo off
echo ========================================
echo Starting Task Monitoring System
echo Using Google Sheets Database
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file with GOOGLE_SHEETS_WEB_APP_URL
    echo.
    echo Example:
    echo GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL/exec
    pause
    exit /b 1
)

echo Starting Python Flask backend (port 5000)...
echo Starting React frontend (port 3000)...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

REM Start Python backend in background
start "Flask Backend" cmd /k "python app.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
cd client
start "React Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Check the windows that opened above.
echo.
pause

