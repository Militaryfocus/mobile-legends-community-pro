#!/bin/bash
echo "=== FULL SYSTEM TEST ==="

TIMESTAMP=$(date +%s)
EMAIL="fulltest_${TIMESTAMP}@test.com"
PASSWORD="FullTest123!"
USERNAME="fulltestuser${TIMESTAMP}"

echo "📧 Test user: $EMAIL"

# 1. РЕГИСТРАЦИЯ
echo -e "\n1. 🔐 REGISTRATION"
REG_RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"username\":\"$USERNAME\"}" \
  -s)

echo "$REG_RESPONSE" | jq .
TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.token')
USER_ID=$(echo "$REG_RESPONSE" | jq -r '.data.user.id')

echo "🔐 Token: $TOKEN"
echo "👤 User ID: $USER_ID"

# 2. ПРОФИЛЬ
echo -e "\n2. 👤 PROFILE ACCESS"
curl -s http://192.168.0.20:3006/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. ЛОГИН (проверка исправления сессий)
echo -e "\n3. 🔑 LOGIN (session test)"
LOGIN_RESPONSE=$(curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c cookies.txt -s)

echo "$LOGIN_RESPONSE" | jq .

# 4. ПРОФИЛЬ ЧЕРЕЗ COOKIES
echo -e "\n4. 🍪 PROFILE VIA COOKIES"
curl -s http://192.168.0.20:3006/api/auth/profile \
  -b cookies.txt | jq .

# 5. SOCIAL ENDPOINTS
echo -e "\n5. 👥 SOCIAL ENDPOINTS"
echo "   Friends list:"
curl -s http://192.168.0.20:3006/api/social/friends \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "   Friend requests:"
curl -s http://192.168.0.20:3006/api/social/friend-requests \
  -H "Authorization: Bearer $TOKEN" | jq .

# 6. GAME ENDPOINTS  
echo -e "\n6. 🎮 GAME ENDPOINTS"
echo "   Heroes:"
curl -s http://192.168.0.20:3006/api/game/heroes | jq . | head -20

echo "   Player stats:"
curl -s "http://192.168.0.20:3006/api/game/player-stats/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 7. TEAM ENDPOINTS
echo -e "\n7. 🏆 TEAM ENDPOINTS"
echo "   Teams list:"
curl -s http://192.168.0.20:3006/api/teams \
  -H "Authorization: Bearer $TOKEN" | jq .

# 8. BUILD ENDPOINTS
echo -e "\n8. 🔧 BUILD ENDPOINTS"
echo "   Builds:"
curl -s http://192.168.0.20:3006/api/builds \
  -H "Authorization: Bearer $TOKEN" | jq .

# 9. VALIDATION TESTS
echo -e "\n9. ⚠️ VALIDATION TESTS"
echo "   Duplicate registration:"
curl -X POST http://192.168.0.20:3006/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"username\":\"$USERNAME\"}" \
  -s | jq .

echo "   Invalid login:"
curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@test.com","password":"wrong"}' \
  -s | jq .

# 10. SYSTEM HEALTH
echo -e "\n10. 🩺 SYSTEM HEALTH"
curl -s http://192.168.0.20:3006/api/health | jq .

echo -e "\n=== TEST COMPLETE ==="
