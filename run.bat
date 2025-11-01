@echo off
echo Killing any existing instances...
taskkill /IM LinqpadRunnerExtension.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo Building and running project...
dotnet run --project "%~dp0linq-extension"
if %errorlevel% neq 0 (
    echo Build/Run failed!
    pause
    exit /b %errorlevel%
)
