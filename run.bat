@echo off
setlocal
echo ==================================================
echo [*] MindCraft - Windows Desktop Launcher
echo ==================================================
cd /d "%~dp0"

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;C:\Program Files\nodejs;%PATH%"
)

echo [*] Starting Vite server and opening browser...
call npm run dev
pause
