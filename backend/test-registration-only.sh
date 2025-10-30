#!/bin/bash
echo "=== Testing Registration Only ==="

TIMESTAMP=$(date +%s)
EMAIL="testuser_${TIMESTAMP}@test.com"
PASSWORD="TestPass123!"

echo "📧 Testing with email: $EMAIL"

# Регистрация
REG_RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"username\":\"testuser${TIMESTAMP}\"}" \
  -s -w "\n%{http_code}")

REG_BODY=$(echo "$REG_RESPONSE" | head -n -1)
REG_STATUS=$(echo "$REG_RESPONSE" | tail -n 1)

echo "Status: $REG_STATUS"
echo "$REG_BODY" | jq .

# Извлекаем токен
TOKEN=$(echo "$REG_BODY" | jq -r '.data.token')
USER_ID=$(echo "$REG_BODY" | jq -r '.data.user.id')

echo -e "\n🔐 Token: $TOKEN"
echo -e "👤 User ID: $USER_ID"

echo -e "\n=== Testing Profile Access ==="
curl -s http://192.168.0.20:3006/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

echo -e "\n=== Testing User Endpoints ==="
echo "User by ID:"
curl -s "http://192.168.0.20:3006/api/users/$USER_ID" | jq .

echo -e "\n=== Testing Health ==="
curl -s http://192.168.0.20:3006/api/health | jq .
