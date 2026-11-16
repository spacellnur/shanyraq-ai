@echo off
chcp 65001 >nul
cd /d "%~dp0"
where python >nul 2>nul && python build.py
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\server.ps1"
