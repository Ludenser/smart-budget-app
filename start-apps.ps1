# PowerShell скрипт для перезапуска приложений Budget Habits

Write-Host "🛑 Останавливаем запущенные процессы..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "🧹 Очищаем кеш .nuxt..." -ForegroundColor Yellow
if (Test-Path "apps/web/.nuxt") { Remove-Item -Recurse -Force "apps/web/.nuxt" }
if (Test-Path "apps/assistant/.nuxt") { Remove-Item -Recurse -Force "apps/assistant/.nuxt" }

Write-Host "🚀 Запускаем приложения..." -ForegroundColor Green
Write-Host ""

# Запускаем web приложение
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd apps/web; pnpm dev" -WindowStyle Normal

# Ждем немного перед запуском второго
Start-Sleep -Seconds 2

# Запускаем assistant приложение
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd apps/assistant; pnpm dev" -WindowStyle Normal

Write-Host "✅ Приложения запущены в отдельных окнах!" -ForegroundColor Green
Write-Host "📱 Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🤖 Assistant: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки закройте окна терминалов" -ForegroundColor Yellow

