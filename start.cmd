@echo off
setlocal
cd /d "%~dp0"
powershell -NoLogo -ExecutionPolicy Bypass -File "%~dp0run-server.ps1"
if errorlevel 1 (
  echo.
  echo Er ging iets mis bij het starten.
  pause
)
