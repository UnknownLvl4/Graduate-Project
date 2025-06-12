REM Start Backend (NestJS)
start "Backend" cmd /k "cd /d %~dp0Backend && npm run start:dev"

REM Start Frontend (React)
start "Frontend" cmd /k "cd /d %~dp0Frontend && npm start"