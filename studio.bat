@echo off
chcp 65001 >nul
rem Studio: panel + podgląd strony na żywo na Twoim komputerze.
rem Zapis w panelu (tryb "Work with Local Repository") = strona w drugim oknie odświeża się sama.
cd /d "%~dp0"
where node >nul 2>nul || (echo Najpierw zainstaluj Node.js LTS ze strony https://nodejs.org i uruchom ten plik ponownie. & pause & exit /b)
if not exist node_modules (echo Pierwsze uruchomienie - instaluję pakiety, to potrwa minutę... & call npx -y pnpm@9.14.4 install)
start "" cmd /c "timeout /t 7 >nul & start http://localhost:4321/admin/ & start http://localhost:4321/?edytuj"
call npx astro dev
