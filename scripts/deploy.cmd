@echo off
REM PROOFCHAIN - Vercel Deployment Script
REM Usage: deploy.cmd [app] [--prod]
REM   app: landing, issuer, verifier, admin, or all (default)
REM   --prod: deploy to production

setlocal enabledelayedexpansion

set APP=%1
set PROD=%2

if "%APP%"=="" set APP=all
if "%PROD%"=="--prod" (
    set PROD_FLAG=--prod
) else (
    set PROD_FLAG=
)

echo.
echo ========================================
echo   PROOFCHAIN - Vercel Deployment
echo ========================================
echo.

REM Build first
echo Building all apps...
call npm run build
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)
echo Build successful!
echo.

if "%APP%"=="all" (
    call :deploy_app landing
    call :deploy_app issuer
    call :deploy_app verifier
    call :deploy_app admin
) else (
    call :deploy_app %APP%
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
goto :eof

:deploy_app
set APP_NAME=%1
echo.
echo Deploying %APP_NAME%...
cd apps\%APP_NAME%

if not exist ".vercel" (
    echo Creating Vercel project...
    call vercel link --yes
)

call vercel %PROD_FLAG%
cd ..\..
echo %APP_NAME% deployed!
goto :eof
