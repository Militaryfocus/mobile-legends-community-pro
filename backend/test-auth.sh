#!/bin/bash
echo "=== Testing JWT Token ==="
curl -X POST http://192.168.0.20:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@test.com","password":"newpass123"}' \
  -c cookies.txt -s | jq .
echo -e "\n=== Testing Profile ==="
curl -s http://192.168.0.20:3006/api/auth/profile -b cookies.txt | jq .
