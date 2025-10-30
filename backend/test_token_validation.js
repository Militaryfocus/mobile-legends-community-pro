const jwt = require('jsonwebtoken');

// Test the exact token that was generated
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWg5bXh2czYwMDAwOXVwdWQxaGxvZDYwIiwiaWF0IjoxNzYxNjAxNTEwLCJleHAiOjE3NjE2MDI0MTB9.Qgm9atyF3DIXJnq28D3q6Gchs7zqXu5RsDkJ6gN3Wpg';

console.log('Testing token validation with current secrets...');

try {
  const decoded = jwt.verify(testToken, 'dev_jwt_secret_2024');
  console.log('✅ Token valid with dev_jwt_secret_2024');
  console.log('Decoded:', decoded);
} catch (error) {
  console.log('❌ Token invalid:', error.message);
}

// Check if token is expired
try {
  const decodedWithoutVerify = jwt.decode(testToken);
  console.log('Token payload:', decodedWithoutVerify);
  console.log('Current time:', Math.floor(Date.now() / 1000));
  console.log('Token expires at:', decodedWithoutVerify.exp);
  console.log('Is expired:', decodedWithoutVerify.exp < Math.floor(Date.now() / 1000));
} catch (error) {
  console.log('Decode error:', error.message);
}
