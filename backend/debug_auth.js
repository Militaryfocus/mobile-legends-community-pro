const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@militaryfocus.ru' }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    // Generate tokens manually to see what's happening
    const accessToken = jwt.sign(
      { userId: user.id },
      'dev_jwt_secret_2024',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      'dev_jwt_refresh_secret_2024', 
      { expiresIn: '7d' }
    );

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('User ID:', user.id);

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
