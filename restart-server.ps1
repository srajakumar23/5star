# Stop any running servers
Write-Host "Stopping any running Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Rebuild with latest code
Write-Host "Rebuilding project..." -ForegroundColor Cyan
npx next build

# Start fresh server
Write-Host "Starting server..." -ForegroundColor Green
npm start
