#!/bin/bash
echo "=== Testing JWT Token ==="
RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@test.com","password":"newpass123"}' \
  -s)

echo "$RESPONSE" | jq .

# Извлекаем токен из ответа
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')

echo -e "\n=== Testing Profile with Bearer token ==="
curl -s http://192.168.0.20:3006/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
