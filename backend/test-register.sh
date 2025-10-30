#!/bin/bash
echo "=== Testing Registration ==="

# Генерируем уникальный email чтобы избежать конфликтов
TIMESTAMP=$(date +%s)
EMAIL="testuser_${TIMESTAMP}@test.com"
PASSWORD="TestPass123!"

echo "📧 Testing with email: $EMAIL"

# Регистрация
curl -X POST http://192.168.0.20:3006/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"username\":\"testuser${TIMESTAMP}\"}" \
  -s | jq .

echo -e "\n=== Testing Login after Registration ==="

# Логин после регистрации
curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -s | jq .

echo -e "\n=== Testing Profile with token ==="

# Извлекаем токен и тестируем профиль
RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -s)

TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')

curl -s http://192.168.0.20:3006/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
