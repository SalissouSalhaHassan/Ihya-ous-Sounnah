@echo off
setlocal

title Manara Mobile - Build APK

set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "SHORT_MOBILE=%DESKTOP_DIR%\CA2A~1\mobile"

if exist "%SHORT_MOBILE%\pubspec.yaml" (
    cd /d "%SHORT_MOBILE%"
) else (
    cd /d "%~dp0"
)

echo [*] Current Directory: %CD%
echo.

set "PATH=C:\src\flutter\bin;%PATH%"

echo [1/3] Running: flutter pub get ...
call flutter pub get

echo.
echo [2/3] Running: flutter analyze ...
call flutter analyze --no-fatal-infos

echo.
echo [3/3] Building APK ...
call flutter build apk --release --no-pub --no-tree-shake-icons

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo [SUCCESS] APK built successfully!
    echo ===================================================
    echo Output file:
    echo %CD%\build\app\outputs\flutter-apk\app-release.apk
    if exist "build\app\outputs\flutter-apk" (
        explorer "build\app\outputs\flutter-apk"
    )
) else (
    echo.
    echo ===================================================
    echo [ERROR] flutter build apk failed.
    echo ===================================================
)

echo.
pause
