@echo off
title CivicEye AI - Full Stack Launcher
echo ======================================================================
echo           Starting CivicEye AI (Spring Boot + React + AI)
echo ======================================================================
echo.

echo [1/2] Starting Spring Boot Backend on http://localhost:8080 ...
start "CivicEye AI - Backend (Spring Boot)" cmd /k "cd server && apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo [2/2] Starting React + Leaflet Frontend on http://localhost:5173 ...
start "CivicEye AI - Frontend (React + Vite)" cmd /k "cd client && npm run dev"

echo.
echo ======================================================================
echo System is launching!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080/api/issues
echo H2 DB Console: http://localhost:8080/h2-console
echo ======================================================================
pause
