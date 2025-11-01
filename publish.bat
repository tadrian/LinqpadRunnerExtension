@echo off
echo Publishing LinqpadRunnerExtension...
taskkill /IM LinqpadRunnerExtension.exe /F >nul 2>&1
taskkill /f /im dotnet.exe >nul 2>&1

echo Note: This is a VS Code extension - publishing as VSIX package.
cd linq-extension
npm run package
if %errorlevel% neq 0 (
    echo Package creation failed!
    pause
    exit /b %errorlevel%
)
echo Published successfully as VSIX package in linq-extension folder!
echo To install: code --install-extension linqpad-runner-*.vsix
pause
