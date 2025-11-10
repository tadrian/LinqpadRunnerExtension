@echo off
echo Publishing LinqpadRunnerExtension...
taskkill /IM LinqpadRunnerExtension.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo.
echo Step 1: Syncing documentation files...
call "%~dp0sync-docs.bat"

echo.
echo Step 2: Compiling TypeScript...
cd linq-extension
call npm run compile
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 3: Publishing to VS Code Marketplace...
call npx vsce publish
if %errorlevel% neq 0 (
    echo Publication failed!
    echo.
    echo NOTE: Make sure you have:
    echo   1. Personal Access Token configured (vsce login ThomasAdrian)
    echo   2. Incremented version number in package.json
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Published successfully to VS Code Marketplace!
echo ========================================
pause
