@echo off
setlocal enabledelayedexpansion

title Manara Awqaf - Automatic Clean Builder

echo ======================================================================
echo          Manara Awqaf and Dawah ERP - Android APK Builder
echo ======================================================================
echo.

set "SOURCE_DIR=%~dp0mobile"
if not exist "%SOURCE_DIR%\pubspec.yaml" (
    set "SOURCE_DIR=%USERPROFILE%\Desktop\CA2A~1\mobile"
)

set "TEMP_BUILD_DIR=%LOCALAPPDATA%\Temp\manara_build_workspace"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "OUTPUT_APK=%DESKTOP_DIR%\manara-app-release.apk"

echo [*] Source directory: %SOURCE_DIR%
echo [*] Pure ASCII build workspace: %TEMP_BUILD_DIR%
echo.

:: 1. إعداد بيئة البناء النظيفة الخالية من أي حرف عربي
echo [1/4] Preparing pure ASCII workspace ...
if exist "%TEMP_BUILD_DIR%" rd /s /q "%TEMP_BUILD_DIR%" >nul 2>&1
mkdir "%TEMP_BUILD_DIR%" >nul 2>&1

echo [*] Copying project files to safe build workspace ...
robocopy "%SOURCE_DIR%" "%TEMP_BUILD_DIR%" /E /XD build .dart_tool android\.gradle /XF *.apk >nul

cd /d "%TEMP_BUILD_DIR%"
set "PATH=C:\src\flutter\bin;%PATH%"

echo.
echo [2/4] Resolving dependencies (flutter pub get) ...
call flutter pub get
if %ERRORLEVEL% neq 0 (
    echo [ERROR] flutter pub get failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Code validation (flutter analyze) ...
call flutter analyze --no-fatal-infos

echo.
echo [4/4] Building Release APK ...
call flutter build apk --release --no-pub --no-tree-shake-icons

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [V] APK BUILT SUCCESSFULLY!
    echo ======================================================================
    
    if exist "build\app\outputs\flutter-apk\app-release.apk" (
        copy /y "build\app\outputs\flutter-apk\app-release.apk" "%OUTPUT_APK%" >nul
        echo [V] Your APK is ready on Desktop:
        echo     %OUTPUT_APK%
        echo.
        
        :: نسخ الملف أيضاً إلى مجلد المشروع الأصلي
        copy /y "build\app\outputs\flutter-apk\app-release.apk" "%~dp0manara-app-release.apk" >nul 2>&1
    )
    
    :: فتح سطح المكتب أو مكان الـ APK
    explorer /select,"%OUTPUT_APK%"
) else (
    echo.
    echo ======================================================================
    echo [X] Build failed.
    echo ======================================================================
)

:: تنظيف مجلد البناء المؤقت بعد الانتهاء
cd /d "%~dp0"
if exist "%TEMP_BUILD_DIR%" rd /s /q "%TEMP_BUILD_DIR%" >nul 2>&1

echo.
pause
