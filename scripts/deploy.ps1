# PROOFCHAIN - Script de déploiement Vercel pour Monorepo
# 
# IMPORTANT: Pour un monorepo, chaque app doit être configurée sur Vercel avec:
# - Root Directory: apps/<app-name>
# - Build Command: cd ../.. && npm install && npx turbo run build --filter=@proofchain/<app-name>
# - Output Directory: .next
#
# Ce script déploie les apps déjà configurées sur Vercel

param(
    [string]$App = "all",
    [switch]$Production = $false,
    [switch]$Setup = $false
)

$ErrorActionPreference = "Continue"

$Apps = [ordered]@{
    "landing"  = "apps/landing"
    "verifier" = "apps/verifier"
    "issuer"   = "apps/issuer"
    "admin"    = "apps/admin"
}

function Show-Setup {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " VERCEL SETUP INSTRUCTIONS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pour chaque app, créez un projet sur https://vercel.com/new :" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($appName in $Apps.Keys) {
        Write-Host "[$appName]" -ForegroundColor Green
        Write-Host "  1. Import GitHub repo: alainpaluku/proofchain"
        Write-Host "  2. Root Directory: $($Apps[$appName])"
        Write-Host "  3. Framework: Next.js"
        Write-Host "  4. Build Command: cd ../.. && npm install && npx turbo run build --filter=@proofchain/$appName"
        Write-Host "  5. Output Directory: .next"
        Write-Host ""
    }
    
    Write-Host "Après configuration, relancez ce script sans -Setup" -ForegroundColor Yellow
}

function Deploy-App {
    param([string]$AppName, [string]$AppPath, [bool]$IsProd)
    
    Write-Host ""
    Write-Host "--- Deploying $AppName ---" -ForegroundColor Cyan
    
    if (-not (Test-Path "$AppPath/.vercel/project.json")) {
        Write-Host "  Not linked. Run: vercel link --cwd $AppPath" -ForegroundColor Yellow
        return $false
    }
    
    Push-Location $AppPath
    
    try {
        if ($IsProd) {
            $result = vercel --prod --yes 2>&1
        } else {
            $result = vercel --yes 2>&1
        }
        
        $resultStr = $result -join " "
        
        if ($resultStr -match "(https://[^\s]+\.vercel\.app)") {
            Write-Host "  OK: $($Matches[1])" -ForegroundColor Green
            Pop-Location
            return $true
        } else {
            Write-Host "  Result: $resultStr" -ForegroundColor Yellow
            Pop-Location
            return $false
        }
    }
    catch {
        Write-Host "  Error: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Main
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   PROOFCHAIN - Vercel Deployment" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

if ($Setup) {
    Show-Setup
    exit 0
}

$mode = if ($Production) { "PRODUCTION" } else { "PREVIEW" }
Write-Host "Mode: $mode" -ForegroundColor Yellow

# Déployer
$results = @{}

if ($App -eq "all") {
    foreach ($appName in $Apps.Keys) {
        $results[$appName] = Deploy-App -AppName $appName -AppPath $Apps[$appName] -IsProd $Production
    }
} elseif ($Apps.Contains($App)) {
    $results[$App] = Deploy-App -AppName $App -AppPath $Apps[$App] -IsProd $Production
} else {
    Write-Host "Unknown app: $App" -ForegroundColor Red
    Write-Host "Available: $($Apps.Keys -join ', ')" -ForegroundColor Yellow
    exit 1
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ok = 0; $fail = 0
foreach ($name in $results.Keys) {
    if ($results[$name]) { 
        Write-Host "  [OK]   $name" -ForegroundColor Green
        $ok++ 
    } else { 
        Write-Host "  [FAIL] $name" -ForegroundColor Red
        $fail++ 
    }
}

Write-Host ""
if ($fail -eq 0) {
    Write-Host "All deployments successful!" -ForegroundColor Green
} else {
    Write-Host "$fail failed. Run with -Setup for configuration help." -ForegroundColor Yellow
}
