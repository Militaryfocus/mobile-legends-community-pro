const http = require('http');

console.log('🔐 Тестирование аутентификации...');

const testData = JSON.stringify({
  email: 'test@example.com',
  password: 'Test123!',
  username: 'testuser'
});

const req = http.request({ 
  hostname: 'localhost', 
  port: 3003, 
  path: '/api/auth/register', 
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  },
  timeout: 5000
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      console.log('✅ Регистрация успешна');
    } else if (res.statusCode === 409) {
      console.log('⚠️ Пользователь уже существует (это нормально)');
    } else {
      console.log('❌ Ошибка регистрации:', res.statusCode, data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Ошибка запроса:', error.message);
});

req.on('timeout', () => {
  console.log('⏰ Таймаут запроса');
});

req.write(testData);
req.end();
