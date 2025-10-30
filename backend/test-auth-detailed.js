const { AuthService, AuthError } = require('./dist/services/AuthService.js');

async function testAuth() {
  console.log('=== AUTH SERVICE TEST ===');
  
  const authService = new AuthService();
  
  try {
    // Тест регистрации
    console.log('1. Testing registration...');
    const regResult = await authService.register({
      email: 'analyzetest@test.com',
      password: 'TestPass123!',
      username: 'analyzetest'
    });
    console.log('✅ Registration:', regResult.user.id);
    
    // Тест логина
    console.log('2. Testing login...');
    const loginResult = await authService.login({
      email: 'analyzetest@test.com',
      password: 'TestPass123!'
    });
    console.log('✅ Login:', loginResult.user.id);
    
    // Тест валидации токена
    console.log('3. Testing token validation...');
    const user = await authService.validateToken(loginResult.token);
    console.log('✅ Token validation:', user ? user.id : 'null');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAuth();
