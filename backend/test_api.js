const http = require('http');

const tests = [
  { path: '/api/health', method: 'GET' },
  { path: '/api/heroes', method: 'GET' },
  { path: '/api/builds', method: 'GET' },
  { path: '/api/teams', method: 'GET' },
  { path: '/api/stats', method: 'GET' },
  { path: '/api/social', method: 'GET' }
];

let completed = 0;

tests.forEach(test => {
  const req = http.request({ 
    hostname: 'localhost', 
    port: 3003, 
    path: test.path, 
    method: test.method,
    timeout: 5000
  }, (res) => {
    console.log(\`✅ \${test.method} \${test.path}: \${res.statusCode}\`);
    completed++;
    if (completed === tests.length) process.exit(0);
  });

  req.on('error', (error) => {
    console.log(\`❌ \${test.method} \${test.path}: \${error.message}\`);
    completed++;
    if (completed === tests.length) process.exit(0);
  });

  req.on('timeout', () => {
    console.log(\`⏰ \${test.method} \${test.path}: timeout\`);
    completed++;
    if (completed === tests.length) process.exit(0);
  });

  req.end();
});

setTimeout(() => {
  console.log('⏰ Тест API завершен по таймауту');
  process.exit(0);
}, 10000);
