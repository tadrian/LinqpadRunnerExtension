@echo off
echo ========================================
echo LinqPad Runner Extension Installer
echo VS Code Insiders Edition
echo Version 1.8.0
echo ========================================
echo.

cd /d "%~dp0linq-extension"

echo Step 1: Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b %errorlevel%
)
echo Compilation successful!
echo.

echo Step 2: Packaging extension...
call npx vsce package
if %errorlevel% neq 0 (
    echo ERROR: Packaging failed!
    pause
    exit /b %errorlevel%
)
echo Packaging successful!
echo.

echo Step 3: Finding .vsix file...
for /f "delims=" %%i in ('dir /b /od linqpad-runner-*.vsix 2^>nul') do set VSIX_FILE=%%i

if not defined VSIX_FILE (
    echo ERROR: No .vsix file found!
    pause
    exit /b 1
)

echo Found: %VSIX_FILE%
echo.

echo Step 4: Installing to VS Code Insiders...
code-insiders --install-extension "%VSIX_FILE%" --force
if %errorlevel% neq 0 (
    echo ERROR: Installation failed!
    echo.
    echo Make sure VS Code Insiders is installed and 'code-insiders' is in your PATH.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo SUCCESS! Extension installed!
echo ========================================
echo.
echo Next steps:
echo 1. Restart VS Code Insiders
echo 2. Open a .linq file to activate the extension
echo 3. Configure LPRun path in settings if needed
echo.
pause
