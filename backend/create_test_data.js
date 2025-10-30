const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
  try {
    const user = await prisma.user.findFirst();
    const hero = await prisma.hero.findFirst();
    
    if (!user || !hero) {
      console.log('No user or hero found');
      return;
    }

    // Create test build
    const build = await prisma.build.create({
      data: {
        name: "Тестовая сборка Alucard",
        description: "Агрессивная сборка для Alucard",
        playstyle: "AGGRESSIVE",
        heroId: hero.id,
        authorId: user.id,
        isPublic: true
      }
    });
    console.log('✅ Created build:', build.id);

    // Create test team
    const team = await prisma.team.create({
      data: {
        name: "Тестовая команда",
        description: "Команда для тестирования",
        leaderId: user.id
      }
    });
    console.log('✅ Created team:', team.id);

  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
