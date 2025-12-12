# PROOFCHAIN - Script de déploiement Vercel
# Déploie chaque application du monorepo sur Vercel

param(
    [string]$App = "all",
    [switch]$Production = $false
)

$ErrorActionPreference = "Stop"

# Configuration des apps
$Apps = @{
    "landing" = @{
        Path = "apps/landing"
        Name = "proofchain-landing"
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
    
    # Créer vercel.json temporaire pour l'app
    $vercelConfig = @{
        "`$schema" = "https://openapi.vercel.sh/vercel.json"
        "framework" = "nextjs"
    } | ConvertTo-Json
    
    # Déployer
    $prodFlag = if ($IsProd) { "--prod" } else { "" }
    
    try {
        Push-Location $appPath
        
        # Vérifier si le projet existe, sinon le créer
        if (-not (Test-Path ".vercel/project.json")) {
            Write-Host "  Creating new Vercel project..." -ForegroundColor Yellow
            vercel link --yes 2>&1 | Out-Null
        }
        
        Write-Host "  Deploying..." -ForegroundColor Yellow
        
        if ($IsProd) {
            $result = vercel --prod 2>&1
        } else {
            $result = vercel 2>&1
        }
        
        # Extraire l'URL
        $url = $result | Select-String -Pattern "https://.*\.vercel\.app" | Select-Object -First 1
        
        if ($url) {
            Write-Host "  ✅ Deployed: $($url.Matches.Value)" -ForegroundColor Green
        } else {
            Write-Host "  ✅ Deployed successfully" -ForegroundColor Green
            Write-Host $result
        }
        
        Pop-Location
        return $true
    }
    catch {
        Write-Host "  ❌ Failed: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Main
Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   PROOFCHAIN - Vercel Deployment     ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Magenta

$mode = if ($Production) { "PRODUCTION" } else { "PREVIEW" }
Write-Host "Mode: $mode" -ForegroundColor Yellow

# Build d'abord
Write-Header "Building all apps"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green

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
        Write-Host "❌ Unknown app: $App" -ForegroundColor Red
        Write-Host "Available apps: $($Apps.Keys -join ', ')" -ForegroundColor Yellow
        exit 1
    }
}

# Résumé
Write-Header "Deployment Summary"
foreach ($appName in $results.Keys) {
    $status = if ($results[$appName]) { "✅" } else { "❌" }
    Write-Host "  $status $appName"
}

$failed = ($results.Values | Where-Object { -not $_ }).Count
if ($failed -gt 0) {
    Write-Host ""
    Write-Host "⚠️  $failed deployment(s) failed" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host ""
    Write-Host "🎉 All deployments successful!" -ForegroundColor Green
}
