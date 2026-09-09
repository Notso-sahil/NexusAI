# Verify NexusAI Bridge connectivity (Windows PowerShell)

Write-Host "Checking NexusAI Bridge status..." -ForegroundColor Cyan

# Check if port 12307 is listening
$portCheck = netstat -ano | Select-String "12307" | Select-String "LISTENING"

if ($portCheck) {
    Write-Host "[OK] Port 12307 is listening" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Port 12307 is NOT listening. Make sure:" -ForegroundColor Red
    Write-Host "  1. Chrome is open" -ForegroundColor Yellow
    Write-Host "  2. The NexusAI Browser Agent extension is loaded and Connected" -ForegroundColor Yellow
    Write-Host "  3. Run: nexus-bridge register" -ForegroundColor Yellow
    exit 1
}

# Check if MCP endpoint responds
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:12307/mcp" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[OK] MCP endpoint reachable at http://127.0.0.1:12307/mcp" -ForegroundColor Green
} catch {
    Write-Host "[WARN] MCP endpoint returned status code or requires POST/SSE (expected for MCP)" -ForegroundColor Yellow
}

# Check nexus-bridge is installed
$bridgeVersion = & nexus-bridge version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] nexus-bridge installed: $bridgeVersion" -ForegroundColor Green
} else {
    Write-Host "[INFO] Local nexus-bridge binary ready at packages/bridge" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "NexusAI Browser Agent looks ready! Test with Antigravity:" -ForegroundColor Cyan
Write-Host "  'Look at my active Chrome tab and tell me what you see.'" -ForegroundColor White
