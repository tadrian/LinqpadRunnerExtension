@echo off
echo ====================================
echo  LinqPad Runner Extension Publisher
echo ====================================
echo.

REM Check if we're in the correct directory
if not exist "package.json" (
    echo Error: package.json not found. Make sure you're running this from the extension directory.
    pause
    exit /b 1
)

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo Error: TypeScript compilation failed
    pause
    exit /b 1
)

echo.
echo [3/5] Packaging extension...
call npx vsce package
if %errorlevel% neq 0 (
    echo Error: Extension packaging failed
    echo Make sure you have vsce installed: npm install -g @vscode/vsce
    pause
    exit /b 1
)

echo.
echo [4/5] Publishing to marketplace...
echo Note: You need to be logged in to vsce. If not logged in, run: vsce login [publisher-name]
call npx vsce publish
if %errorlevel% neq 0 (
    echo Error: Publishing failed
    echo Make sure you're logged in: vsce login ThomasAdrian
    pause
    exit /b 1
)

echo.
echo [5/5] Success!
echo ====================================
echo Extension published successfully! 🎉
echo ====================================
echo.
pause
