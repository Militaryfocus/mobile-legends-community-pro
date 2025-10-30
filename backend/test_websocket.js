const { io } = require('socket.io-client');

console.log('🔌 Тестирование WebSocket...');

const socket = io('http://localhost:3003', {
  transports: ['websocket'],
  timeout: 5000
});

socket.on('connect', () => {
  console.log('✅ WebSocket подключен');
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (error) => {
  console.log('❌ WebSocket ошибка:', error.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('⏰ WebSocket timeout');
  socket.disconnect();
  process.exit(1);
}, 5000);
