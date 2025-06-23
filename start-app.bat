@echo off
echo Starting Codons Visualizer Application...
echo.

REM Check if we're in the correct directory
if not exist "backend\app.py" (
    echo Error: backend\app.py not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo Error: frontend\package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Create log directory if it doesn't exist
if not exist "logs" mkdir logs

echo [%TIME%] Starting Flask backend...
cd backend

REM Check if virtual environment exists
if not exist ".venv" (
    echo Error: Virtual environment not found at backend\.venv
    echo Please create a virtual environment first:
    echo   cd backend
    echo   python -m venv .venv
    echo   .venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

REM Activate virtual environment and start Flask
call .venv\Scripts\activate
if errorlevel 1 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)

echo [%TIME%] Virtual environment activated
echo [%TIME%] Starting Flask server on http://localhost:5000
start "Flask Backend" cmd /k "flask run --host=0.0.0.0 --port=5000 2>&1 | tee ..\logs\backend.log"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Go to frontend directory
cd ..\frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo [%TIME%] Installing frontend dependencies...
    pnpm install
    if errorlevel 1 (
        echo Error: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo [%TIME%] Starting frontend development server on http://localhost:8080
start "Frontend Dev Server" cmd /k "pnpm run dev --port 8080 --host 0.0.0.0 2>&1 | tee ..\logs\frontend.log"

echo.
echo ========================================
echo Application started successfully!
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Logs are saved in the 'logs' directory
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open the application in default browser
start http://localhost:8080

echo.
echo To stop the application:
echo 1. Close both command windows (Flask Backend and Frontend Dev Server)
echo 2. Or press Ctrl+C in each window
echo.
echo Press any key to exit this script...
pause >nul
