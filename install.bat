@echo off
echo Installing Task Monitoring System...
echo.

echo Step 1: Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
pause

