# PROOFCHAIN - Script de déploiement Vercel
# Déploie chaque application du monorepo sur Vercel

param(
    [string]$App = "all",
    [switch]$Production = $false
)

$ErrorActionPreference = "Continue"

# Configuration des apps
$Apps = @{
    "landing" = @{
        Path = "apps/landing"
        Name = "proofchains"
    }
    "issuer" = @{
        Path = "apps/issuer"
        Name = "proofchain-issuer"
    }
    "verifier" = @{
        Path = "apps/verifier"
        Name = "proofchain-verifier"
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
    $projectName = $Config.Name
    
    Write-Host "  Path: $appPath" -ForegroundColor Gray
    Write-Host "  Project: $projectName" -ForegroundColor Gray
    
    try {
        Push-Location $appPath
        
        # Vérifier si le projet existe, sinon le créer
        if (-not (Test-Path ".vercel/project.json")) {
            Write-Host "  Linking Vercel project..." -ForegroundColor Yellow
            $linkResult = vercel link --yes 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Host "  Warning: Link may have issues" -ForegroundColor Yellow
            }
        }
        
        Write-Host "  Deploying..." -ForegroundColor Yellow
        
        # Déployer avec --yes pour éviter les prompts
        if ($IsProd) {
            $result = vercel --prod --yes 2>&1
        } else {
            $result = vercel --yes 2>&1
        }
        
        # Vérifier le résultat
        $resultStr = $result -join "`n"
        
        if ($resultStr -match "https://[^\s]+\.vercel\.app") {
            $url = $Matches[0]
            Write-Host "  Deployed: $url" -ForegroundColor Green
            Pop-Location
            return $true
        } elseif ($resultStr -match "Error") {
            Write-Host "  Error: $resultStr" -ForegroundColor Red
            Pop-Location
            return $false
        } else {
            Write-Host "  Result: $resultStr" -ForegroundColor Yellow
            Pop-Location
            return $true
        }
    }
    catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Main
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "   PROOFCHAIN - Vercel Deployment" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

$mode = if ($Production) { "PRODUCTION" } else { "PREVIEW" }
Write-Host "Mode: $mode" -ForegroundColor Yellow
Write-Host ""

# Build d'abord
Write-Header "Building all apps"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful" -ForegroundColor Green

# Déployer
$results = @{}

if ($App -eq "all") {
    foreach ($appName in $Apps.Keys) {
        $results[$appName] = Deploy-App -AppName $appName -Config $Apps[$appName] -IsProd $Production
    }
} else {
    if ($Apps.ContainsKey($App)) {
        $results[$App] = Deploy-App -AppName $App -Config $Apps[$App] -IsProd $Production
    } else {
        Write-Host "Unknown app: $App" -ForegroundColor Red
        Write-Host "Available apps: $($Apps.Keys -join ', ')" -ForegroundColor Yellow
        exit 1
    }
}

# Résumé
Write-Header "Deployment Summary"
foreach ($appName in $results.Keys) {
    $status = if ($results[$appName]) { "[OK]" } else { "[FAIL]" }
    $color = if ($results[$appName]) { "Green" } else { "Red" }
    Write-Host "  $status $appName" -ForegroundColor $color
}

$failed = ($results.Values | Where-Object { -not $_ }).Count
if ($failed -gt 0) {
    Write-Host ""
    Write-Host "$failed deployment(s) failed" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host ""
    Write-Host "All deployments successful!" -ForegroundColor Green
}
