#!/bin/bash
echo "=== Testing Registration ==="

TIMESTAMP=$(date +%s)
EMAIL="testuser_${TIMESTAMP}@test.com"
PASSWORD="TestPass123!"

echo "📧 Testing with email: $EMAIL"

# Регистрация
REG_RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"username\":\"testuser${TIMESTAMP}\"}" \
  -s)

echo "$REG_RESPONSE" | jq .

# Извлекаем токен ПРАВИЛЬНО
TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.token')
echo -e "\n🔐 Token from registration: $TOKEN"

echo -e "\n=== Testing Profile with registration token ==="
curl -s http://192.168.0.20:3006/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

echo -e "\n=== Testing Login ==="
LOGIN_RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -s)

echo "$LOGIN_RESPONSE" | jq .

# Извлекаем токен из логина
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user | select(. != null) | .token? // empty')
if [ -z "$LOGIN_TOKEN" ]; then
  LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
fi

echo -e "\n🔐 Token from login: $LOGIN_TOKEN"

echo -e "\n=== Testing Profile with login token ==="
curl -s http://192.168.0.20:3006/api/auth/profile \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -H "Content-Type: application/json" | jq .
