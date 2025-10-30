#!/bin/bash

PORT=${1:-3003}
MAX_ATTEMPTS=3
ATTEMPT=1

echo "🚀 Запуск сервера на порту $PORT..."

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Попытка $ATTEMPT из $MAX_ATTEMPTS..."
    
    # Проверяем занят ли порт
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
        echo "⚠️  Порт $PORT занят. Освобождаем..."
        sudo fuser -k $PORT/tcp 2>/dev/null
        sleep 2
    fi
    
    # Запускаем сервер
    PORT=$PORT npm start &
    SERVER_PID=$!
    sleep 3
    
    # Проверяем запустился ли сервер
    if ps -p $SERVER_PID > /dev/null; then
        echo "✅ Сервер успешно запущен на порту $PORT (PID: $SERVER_PID)"
        echo "🔗 Health check: http://localhost:$PORT/api/health"
        break
    else
        echo "❌ Попытка $ATTEMPT не удалась"
        ((ATTEMPT++))
    fi
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "💥 Не удалось запустить сервер после $MAX_ATTEMPTS попыток"
    exit 1
fi

# Ждем завершения сервера
wait $SERVER_PID
