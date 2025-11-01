@echo off
echo ====================================
echo  LinqPad Runner Extension Packager
echo ====================================
echo.

REM Check if we're in the correct directory
if not exist "package.json" (
    echo Error: package.json not found. Make sure you're running this from the extension directory.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo Error: TypeScript compilation failed
    pause
    exit /b 1
)

echo.
echo [3/4] Packaging extension...
call npx vsce package
if %errorlevel% neq 0 (
    echo Error: Extension packaging failed
    echo Make sure you have vsce installed: npm install -g @vscode/vsce
    pause
    exit /b 1
)

echo.
echo [4/4] Success!
echo ====================================
echo Extension packaged successfully! 📦
echo ====================================
echo The .vsix file is ready for manual installation or distribution.
echo To install manually: code --install-extension [filename].vsix
echo.
pause
