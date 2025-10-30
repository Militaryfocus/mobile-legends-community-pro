// This will check what secrets the server process is actually using
const result = require('./dist/services/AuthService.js');
console.log('Checking AuthService...');

// Check environment variables in the process
console.log('JWT_SECRET in env:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET in env:', process.env.JWT_REFRESH_SECRET);
