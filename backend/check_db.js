const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    await prisma.$connect();
    console.log('✅ База данных подключена');
    const count = await prisma.user.count();
    console.log('👥 Пользователей:', count);
    await prisma.$disconnect();
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}
test();
