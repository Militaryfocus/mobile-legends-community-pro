const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Проверка всей базы данных...\n');

    // 1. Проверка пользователей
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true, role: true, createdAt: true },
      take: 5
    });
    console.log('👥 Пользователи:', users.length);
    console.log('Последние 5:', users);

    // 2. Проверка героев
    const heroes = await prisma.hero.findMany({
      select: { id: true, name: true, role: true },
      take: 5
    });
    console.log('\n🎮 Герои:', heroes.length);
    console.log('Примеры:', heroes);

    // 3. Проверка сборок
    const builds = await prisma.build.findMany({
      select: { id: true, name: true, hero: { select: { name: true } } },
      take: 5
    });
    console.log('\n🛠️ Сборки:', builds.length);
    console.log('Примеры:', builds);

    // 4. Проверка постов
    const posts = await prisma.post.findMany({
      select: { id: true, title: true, type: true },
      take: 5
    });
    console.log('\n📝 Посты:', posts.length);
    console.log('Примеры:', posts);

    // 5. Проверка команд
    const teams = await prisma.team.findMany({
      select: { id: true, name: true, leader: { select: { username: true } } },
      take: 5
    });
    console.log('\n👥 Команды:', teams.length);
    console.log('Примеры:', teams);

    // 6. Статистика по всем таблицам
    console.log('\n📊 СТАТИСТИКА БАЗЫ ДАННЫХ:');
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.hero.count(),
      prisma.build.count(),
      prisma.post.count(),
      prisma.team.count(),
      prisma.playerStats.count(),
      prisma.item.count(),
      prisma.notification.count()
    ]);

    console.log(`👥 Пользователей: ${stats[0]}`);
    console.log(`🎮 Героев: ${stats[1]}`);
    console.log(`🛠️ Сборок: ${stats[2]}`);
    console.log(`📝 Постов: ${stats[3]}`);
    console.log(`👥 Команд: ${stats[4]}`);
    console.log(`📈 Статистик игроков: ${stats[5]}`);
    console.log(`🎒 Предметов: ${stats[6]}`);
    console.log(`🔔 Уведомлений: ${stats[7]}`);

    // 7. Проверка связей
    console.log('\n🔗 ПРОВЕРКА СВЯЗЕЙ:');
    
    const userWithRelations = await prisma.user.findFirst({
      include: {
        builds: { take: 1 },
        posts: { take: 1 },
        createdTeams: { take: 1 },
        matchStats: { take: 1, include: { hero: true } }
      }
    });

    if (userWithRelations) {
      console.log('Пользователь со связями:');
      console.log(`- Сборок: ${userWithRelations.builds.length}`);
      console.log(`- Постов: ${userWithRelations.posts.length}`);
      console.log(`- Команд: ${userWithRelations.createdTeams.length}`);
      console.log(`- Статистик: ${userWithRelations.matchStats.length}`);
    }

    console.log('\n✅ База данных работает корректно!');

  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
