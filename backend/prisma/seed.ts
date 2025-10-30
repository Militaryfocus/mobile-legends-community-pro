import { PrismaClient, HeroRole, ItemType, ItemTier, EmblemType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начало заполнения базы данных...');

  // 1. Создаем героев Mobile Legends
  console.log('🎮 Создание героев...');
  const heroes = await prisma.hero.createManyAndReturn({
    data: [
      {
        name: 'Miya',
        title: 'Стрелок Эльфов',
        role: HeroRole.MARKSMAN,
        difficulty: 2,
        description: 'Дальний боец с высоким уроном'
      },
      {
        name: 'Alucard',
        title: 'Демонический Наследник',
        role: HeroRole.FIGHTER,
        difficulty: 3,
        description: 'Ближний боец с самолечением'
      },
      {
        name: 'Eudora',
        title: 'Маг Грома',
        role: HeroRole.MAGE,
        difficulty: 2,
        description: 'Маг с контролем и взрывным уроном'
      },
      {
        name: 'Tigreal',
        title: 'Воин Света',
        role: HeroRole.TANK,
        difficulty: 2,
        description: 'Танк с массовым контролем'
      },
      {
        name: 'Saber',
        title: 'Бегущий по Лезвию',
        role: HeroRole.ASSASSIN,
        difficulty: 3,
        description: 'Ассассин с высоким взрывным уроном'
      },
      {
        name: 'Rafaela',
        title: 'Посланница Ветра',
        role: HeroRole.SUPPORT,
        difficulty: 1,
        description: 'Поддержка с лечением и контролем'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Создано героев: ${heroes.length}`);

  // 2. Создаем способности для героев
  console.log('✨ Создание способностей...');
  for (const hero of heroes) {
    await prisma.ability.createMany({
      data: [
        { name: 'Базовая атака', description: 'Основная атака', heroId: hero.id },
        { name: 'Первая способность', description: 'Уникальная способность героя', heroId: hero.id },
        { name: 'Вторая способность', description: 'Уникальная способность героя', heroId: hero.id },
        { name: 'Ультимативная способность', description: 'Мощная ультимативная способность', heroId: hero.id }
      ],
      skipDuplicates: true
    });
  }
  console.log('✅ Способности созданы');

  // 3. Создаем предметы
  console.log('🎒 Создание предметов...');
  const items = await prisma.item.createMany({
    data: [
      // Атакующие предметы
      {
        id: 'item_blade_of_despair',
        name: 'Клинок Отчаяния',
        description: 'Увеличивает физическую атаку',
        type: ItemType.ATTACK,
        price: 3010,
        tier: ItemTier.LEGENDARY,
        iconUrl: '/items/blade_of_despair.png'
      },
      {
        id: 'item_endless_battle',
        name: 'Бесконечная Битва',
        description: 'Универсальный предмет для бойцов',
        type: ItemType.ATTACK,
        price: 2470,
        tier: ItemTier.LEGENDARY,
        iconUrl: '/items/endless_battle.png'
      },
      // Защитные предметы
      {
        id: 'item_immortality',
        name: 'Бессмертие',
        description: 'Возрождение после смерти',
        type: ItemType.DEFENSE,
        price: 2120,
        tier: ItemTier.LEGENDARY,
        iconUrl: '/items/immortality.png'
      },
      {
        id: 'item_queens_wings',
        name: 'Крылья Королевы',
        description: 'Уменьшение получаемого урона',
        type: ItemType.DEFENSE,
        price: 2250,
        tier: ItemTier.LEGENDARY,
        iconUrl: '/items/queens_wings.png'
      },
      // Магические предметы
      {
        id: 'item_lightning_truncheon',
        name: 'Жезл Молний',
        description: 'Магический урон с цепной молнией',
        type: ItemType.MAGIC,
        price: 2250,
        tier: ItemTier.LEGENDARY,
        iconUrl: '/items/lightning_truncheon.png'
      },
      {
        id: 'item_glowing_wand',
        name: 'Светящийся Жезл',
        description: 'Процентный магический урон',
        type: ItemType.MAGIC,
        price: 2150,
        tier: ItemTier.LEGENDARY,
        iconUrl: '/items/glowing_wand.png'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Создано предметов: ${items.count}`);

  // 4. Создаем эмблемы
  console.log('🛡️ Создание эмблем...');
  const emblems = await prisma.emblem.createMany({
    data: [
      {
        id: 'emblem_common',
        name: 'Обычная Эмблема',
        type: EmblemType.COMMON,
        description: 'Базовая эмблема для всех героев',
        iconUrl: '/emblems/common.png'
      },
      {
        id: 'emblem_assassin',
        name: 'Эмблема Убийцы',
        type: EmblemType.ASSASSIN,
        description: 'Эмблема для ассассинов',
        iconUrl: '/emblems/assassin.png'
      },
      {
        id: 'emblem_mage',
        name: 'Эмблема Мага',
        type: EmblemType.MAGE,
        description: 'Эмблема для магов',
        iconUrl: '/emblems/mage.png'
      },
      {
        id: 'emblem_marksman',
        name: 'Эмблема Стрелка',
        type: EmblemType.MARKSMAN,
        description: 'Эмблема для стрелков',
        iconUrl: '/emblems/marksman.png'
      },
      {
        id: 'emblem_tank',
        name: 'Эмблема Танка',
        type: EmblemType.TANK,
        description: 'Эмблема для танков',
        iconUrl: '/emblems/tank.png'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Создано эмблем: ${emblems.count}`);

  // 5. Создаем заклинания
  console.log('🔮 Создание заклинаний...');
  const spells = await prisma.spell.createMany({
    data: [
      {
        id: 'spell_flicker',
        name: 'Мерцание',
        description: 'Короткое мгновенное перемещение',
        cooldown: 120,
        iconUrl: '/spells/flicker.png'
      },
      {
        id: 'spell_purify',
        name: 'Очищение',
        description: 'Снимает все эффекты контроля',
        cooldown: 120,
        iconUrl: '/spells/purify.png'
      },
      {
        id: 'spell_retribution',
        name: 'Возмездие',
        description: 'Урон по крипам и монстрам',
        cooldown: 30,
        iconUrl: '/spells/retribution.png'
      },
      {
        id: 'spell_flameshot',
        name: 'Огненный Выстрел',
        description: 'Дальнобойный урон и отталкивание',
        cooldown: 60,
        iconUrl: '/spells/flameshot.png'
      }
    ],
    skipDuplicates: true
  });
  console.log(`✅ Создано заклинаний: ${spells.count}`);

  console.log('🎉 Заполнение базы данных завершено!');
  console.log('📊 Статистика:');
  console.log(`   🎮 Героев: ${heroes.length}`);
  console.log(`   🎒 Предметов: ${items.count}`);
  console.log(`   🛡️ Эмблем: ${emblems.count}`);
  console.log(`   🔮 Заклинаний: ${spells.count}`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
