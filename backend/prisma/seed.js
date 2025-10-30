"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    // Создаем тестовых героев
    const heroes = [
        {
            name: 'Alucard',
            title: 'The Demon Hunter',
            role: client_1.HeroRole.ASSASSIN,
            difficulty: 6,
            description: 'Powerful fighter with lifesteal abilities'
        },
        {
            name: 'Miya',
            title: 'Moonlight Archer',
            role: client_1.HeroRole.MARKSMAN,
            difficulty: 3,
            description: 'Ranged damage dealer with high attack speed'
        },
        {
            name: 'Tigreal',
            title: 'The Warrior of Dawn',
            role: client_1.HeroRole.TANK,
            difficulty: 4,
            description: 'Durable tank with crowd control abilities'
        },
        {
            name: 'Eudora',
            title: 'The Lightning Sorceress',
            role: client_1.HeroRole.MAGE,
            difficulty: 5,
            description: 'Burst mage with powerful lightning spells'
        },
        {
            name: 'Balmond',
            title: 'The Bloody Beast',
            role: client_1.HeroRole.FIGHTER,
            difficulty: 3,
            description: 'Sustained fighter with area damage'
        },
        {
            name: 'Rafaela',
            title: 'The Wings of Heaven',
            role: client_1.HeroRole.SUPPORT,
            difficulty: 2,
            description: 'Healing support with crowd control'
        }
    ];
    for (const hero of heroes) {
        await prisma.hero.upsert({
            where: { name: hero.name },
            update: {},
            create: hero
        });
        console.log(`Created hero: ${hero.name}`);
    }
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map