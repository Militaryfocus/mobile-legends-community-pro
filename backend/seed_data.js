const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // Создаем тестовые сборки
  const build = await prisma.build.create({
    data: {
      name: "Тестовая сборка",
      description: "Пример сборки для Alucard",
      playstyle: "AGGRESSIVE",
      heroId: "cmh9gqopa00019ui12ibh75ot", // Alucard ID
      authorId: (await prisma.user.findFirst()).id,
      isPublic: true
    }
  });
  console.log('Created build:', build.id);

  // Создаем тестовую команду
  const team = await prisma.team.create({
    data: {
      name: "Тестовая команда",
      description: "Пример команды",
      leaderId: (await prisma.user.findFirst()).id
    }
  });
  console.log('Created team:', team.id);

  await prisma.$disconnect();
}

seed().catch(console.error);
