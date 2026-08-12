@echo off
echo Starting AceCoach-AI Full Stack...
echo Installing dependencies (if any)...
call npm install
echo.
echo Starting Unified Development Server...
echo The application will run both frontend and backend concurrently!
echo Frontend will be accessible at http://localhost:5173/ and will proxy API requests to backend.
echo.
echo ========================================================
echo ✅ Launching AceCoach-AI...
echo ========================================================
npm run dev
pause
