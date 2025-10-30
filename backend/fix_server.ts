// Удаляем проблемную строку с debug endpoint
sed -i '/error: error.message/d' src/server.ts
