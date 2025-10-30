const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDB() {
  try {
    await prisma.$connect();
    console.log('✅ База данных подключена');
    
    // Простой запрос для проверки
    const userCount = await prisma.user.count();
    console.log('👥 Пользователей в базе:', userCount);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Ошибка БД:', error.message);
  }
}
testDB();
