@echo off
echo Syncing documentation files...
echo.

echo Copying CHANGELOG.md to linq-extension folder...
copy /Y "%~dp0CHANGELOG.md" "%~dp0linq-extension\changelog.md" >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy CHANGELOG.md
    pause
    exit /b %errorlevel%
)
echo ✓ CHANGELOG.md synced

echo Copying README.md to linq-extension folder...
copy /Y "%~dp0README.md" "%~dp0linq-extension\readme.md" >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy README.md
    pause
    exit /b %errorlevel%
)
echo ✓ README.md synced

echo.
echo ========================================
echo Documentation files synced successfully!
echo ========================================
echo.
echo Files updated:
echo   - linq-extension\changelog.md
echo   - linq-extension\readme.md
echo.
pause
