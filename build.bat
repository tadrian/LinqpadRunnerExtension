@echo off
echo Killing any existing instances...
taskkill /IM LinqpadRunnerExtension.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo Building project...
cd linq-extension
npm run compile
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo Build completed successfully!
pause
