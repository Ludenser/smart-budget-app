#!/bin/bash

# Bash скрипт для перезапуска приложений Budget Habits

echo "🛑 Останавливаем запущенные процессы..."
pkill -f "pnpm dev" 2>/dev/null || true

echo "🧹 Очищаем кеш .nuxt..."
rm -rf apps/web/.nuxt
rm -rf apps/assistant/.nuxt

echo "🚀 Запускаем web приложение на порту 3000..."
cd apps/web && pnpm dev &
WEB_PID=$!

echo "⏳ Ждем 3 секунды..."
sleep 3

echo "🚀 Запускаем assistant приложение на порту 3001..."
cd ../assistant && pnpm dev &
ASSISTANT_PID=$!

echo ""
echo "✅ Приложения запущены!"
echo "📱 Web: http://localhost:3000"
echo "🤖 Assistant: http://localhost:3001"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Ждем сигнала завершения
trap "echo '🛑 Останавливаем приложения...'; kill $WEB_PID $ASSISTANT_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Ждем завершения процессов
wait

