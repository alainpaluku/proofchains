# PROOFCHAIN - Script de déploiement Vercel
# Déploie chaque application du monorepo sur Vercel
# Utilise les builds locaux pré-compilés

param(
    [string]$App = "all",
    [switch]$Production = $false
)

$ErrorActionPreference = "Continue"

# Configuration des apps
$Apps = [ordered]@{
    "landing" = @{
        Path = "apps/landing"
        Name = "proofchains"
    }
    "verifier" = @{
        Path = "apps/verifier"
        Name = "proofchain-verifier"
    }
    "issuer" = @{
        Path = "apps/issuer"
        Name = "proofchain-issuer"
    }
    "admin" = @{
        Path = "apps/admin"
        Name = "proofchain-admin"
    }
}

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Deploy-App {
    param(
        [string]$AppName,
        [hashtable]$Config,
        [bool]$IsProd
    )
    
    Write-Header "Deploying $AppName"
    
    $appPath = $Config.Path
    
    Write-Host "  Path: $appPath" -ForegroundColor Gray
    
    # Vérifier que le build existe
    if (-not (Test-Path "$appPath/.next")) {
        Write-Host "  ERROR: Build not found. Run 'npm run build' first." -ForegroundColor Red
        return $false
    }
    
    try {
        Push-Location $appPath
        
        # Lier le projet si nécessaire
        if (-not (Test-Path ".vercel/project.json")) {
            Write-Host "  Linking Vercel project..." -ForegroundColor Yellow
            vercel link --yes 2>&1 | Out-Null
        }
        
        Write-Host "  Deploying prebuilt..." -ForegroundColor Yellow
        
        # Déployer avec --prebuilt pour utiliser le build local
        if ($IsProd) {
            $result = vercel deploy --prebuilt --prod --yes 2>&1
        } else {
            $result = vercel deploy --prebuilt --yes 2>&1
        }
        
        $resultStr = $result -join "`n"
        
        if ($resultStr -match "(https://[^\s]+\.vercel\.app)") {
            $url = $Matches[1]
            Write-Host "  SUCCESS: $url" -ForegroundColor Green
            Pop-Location
            return $true
        } elseif ($resultStr -match "Error|error") {
            Write-Host "  FAILED: $resultStr" -ForegroundColor Red
            Pop-Location
            return $false
        } else {
            Write-Host "  $resultStr" -ForegroundColor Yellow
            Pop-Location
            return $true
        }
    }
    catch {
        Write-Host "  EXCEPTION: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Main
Clear-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   PROOFCHAIN - Vercel Deployment" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

$mode = if ($Production) { "PRODUCTION" } else { "PREVIEW" }
Write-Host "Mode: $mode" -ForegroundColor Yellow
Write-Host ""

# Build d'abord
Write-Header "Building all apps with Turbo"
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful" -ForegroundColor Green

# Préparer les builds pour Vercel
Write-Header "Preparing Vercel builds"
foreach ($appName in $Apps.Keys) {
    $appPath = $Apps[$appName].Path
    Write-Host "  Preparing $appName..." -ForegroundColor Gray
    
    Push-Location $appPath
    vercel build 2>&1 | Out-Null
    Pop-Location
}
Write-Host "Preparation complete" -ForegroundColor Green

# Déployer
$results = [ordered]@{}

if ($App -eq "all") {
    foreach ($appName in $Apps.Keys) {
        $results[$appName] = Deploy-App -AppName $appName -Config $Apps[$appName] -IsProd $Production
    }
} else {
    if ($Apps.Contains($App)) {
        $results[$App] = Deploy-App -AppName $App -Config $Apps[$App] -IsProd $Production
    } else {
        Write-Host "Unknown app: $App" -ForegroundColor Red
        Write-Host "Available: landing, verifier, issuer, admin" -ForegroundColor Yellow
        exit 1
    }
}

# Résumé
Write-Header "Deployment Summary"
$successCount = 0
$failCount = 0

foreach ($appName in $results.Keys) {
    if ($results[$appName]) {
        Write-Host "  [OK]   $appName" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  [FAIL] $appName" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
if ($failCount -gt 0) {
    Write-Host "$failCount deployment(s) failed, $successCount succeeded" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "All $successCount deployments successful!" -ForegroundColor Green
    exit 0
}
