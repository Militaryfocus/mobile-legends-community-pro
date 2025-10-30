const jwt = require('jsonwebtoken');

// Токен из последнего логина
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWg5b3k4MGkwMDAwOXUzam0yb3Q1eHF2IiwiaWF0IjoxNzYxNjAzMDQ1LCJleHAiOjE3NjE2MDM5NDV9.GG7R6wlF7k5Fk6Ug3iOnQxW8-LlpiyIEN_DezAZL598';

console.log('=== TOKEN VALIDATION TEST ===');
console.log('Token:', token);

const secrets = [
  'dev_jwt_secret_2024',
  process.env.JWT_SECRET,
  'wrong_secret'
];

secrets.forEach(secret => {
  try {
    const decoded = jwt.verify(token, secret);
    console.log('✅ VALID with secret:', secret);
    console.log('   Decoded:', decoded);
  } catch (error) {
    console.log('❌ INVALID with secret:', secret, '-', error.message);
  }
});
