// Этот код покажет какие секреты использует сервер
const result = require('./dist/services/AuthService.js');
console.log('AuthService loaded');

// Проверим process.env в контексте сервера
console.log('=== SERVER ENVIRONMENT ===');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);
