$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = "C:\Users\kejes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$server = Join-Path $root "server.js"

try {
    if (-not (Test-Path $node)) {
        throw "Node runtime niet gevonden op: $node"
    }

    if (-not (Test-Path $server)) {
        throw "server.js niet gevonden op: $server"
    }

    Set-Location $root
    Write-Host ""
    Write-Host "WK Toto start op..." -ForegroundColor Cyan
    Write-Host "Open daarna: http://localhost:3000" -ForegroundColor Green
    Write-Host ""

    & $node $server
}
catch {
    Write-Host ""
    Write-Host "Starten mislukt:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Read-Host "Druk op Enter om af te sluiten"
}
