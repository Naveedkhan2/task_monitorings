@echo off
echo Installing Python Dependencies...
echo.

echo Step 1: Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Flask and dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo Installation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the application, run:
echo   python app.py
echo   OR
echo   run_python.bat
echo.
pause

