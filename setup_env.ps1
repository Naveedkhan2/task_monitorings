# Setup .env file for Google Sheets configuration
# This script helps you create the .env file with your Google Sheets Web App URL

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Google Sheets Configuration Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled. Exiting..." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Please enter your Google Sheets Web App URL:" -ForegroundColor Green
Write-Host "(It should look like: https://script.google.com/macros/s/AKfycbz.../exec)" -ForegroundColor Gray
Write-Host ""

$webAppUrl = Read-Host "Web App URL"

# Validate URL
if ([string]::IsNullOrWhiteSpace($webAppUrl)) {
    Write-Host "❌ Error: URL cannot be empty!" -ForegroundColor Red
    exit 1
}

if (-not $webAppUrl.StartsWith("https://script.google.com/macros/s/")) {
    Write-Host "⚠️  Warning: URL doesn't look like a Google Apps Script Web App URL" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Cancelled. Exiting..." -ForegroundColor Yellow
        exit
    }
}

# Create .env file
$envContent = @"
# Google Sheets Web App URL
# Get this URL after deploying Apps Script as Web App
# Format: https://script.google.com/macros/s/AKfycbz.../exec
GOOGLE_SHEETS_WEB_APP_URL=$webAppUrl
"@

try {
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host ""
    Write-Host "✅ Success! .env file created." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Restart your Flask app (python app.py)" -ForegroundColor White
    Write-Host "2. The 'Google Sheets not configured' error should be gone!" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Error creating .env file: $_" -ForegroundColor Red
    exit 1
}

