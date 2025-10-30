#!/bin/bash
echo "=== FULL SYSTEM ANALYSIS ==="

echo -e "\n📁 PROJECT STRUCTURE:"
find src/ -type f -name "*.ts" | grep -v node_modules | sort | head -20

echo -e "\n🔧 SERVICES:"
find src/services/ -name "*.ts" -type f | while read file; do
  echo "--- $file ---"
  grep -E "class|export|async" "$file" | head -10
  echo
done

echo -e "\n🎯 CONTROLLERS:"
find src/controllers/ -name "*.ts" -type f | while read file; do
  echo "--- $file ---"
  grep -E "router\.|app\." "$file" | head -10
  echo
done

echo -e "\n📊 MODELS (Prisma):"
if [ -f "prisma/schema.prisma" ]; then
  grep -E "model|enum" prisma/schema.prisma | head -20
fi

echo -e "\n🛣️  ROUTES:"
find src/ -name "*route*" -o -name "*controller*" | grep -v node_modules | while read file; do
  echo "--- $file ---"
  grep -E "GET|POST|PUT|DELETE" "$file" | head -10
  echo
done
