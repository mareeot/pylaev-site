@echo off
cd /d "%~dp0"
echo ====================================
echo   ПЫЛАЕВ — музыкальный сайт
echo ====================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не найден, открываю без сервера...
  start index.html
  echo.
  echo P.S. Если треки не играют — установи Node.js или
  echo      открой в Firefox.
  pause
  exit
)
echo Запускаю сервер...
start /B node server.js
timeout /t 2 >nul
echo Открываю браузер...
start http://localhost:3000
echo.
echo Сервер запущен: http://localhost:3000
echo Закрой это окно чтобы остановить.
echo ====================================
:loop
timeout /t 3 >nul
tasklist 2>nul | find "node.exe" >nul
if errorlevel 1 exit
goto loop
