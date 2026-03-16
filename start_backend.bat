@echo off
echo ========================================
echo Starting Python Flask Backend
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file with GOOGLE_SHEETS_WEB_APP_URL
    pause
    exit /b 1
)

echo Checking Python dependencies...
python -c "import flask" 2>nul
if errorlevel 1 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)

echo.
echo Starting Flask backend on http://localhost:5000
echo Press Ctrl+C to stop
echo.
python app.py
pause

