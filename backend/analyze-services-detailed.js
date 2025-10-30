const fs = require('fs');
const path = require('path');

console.log('=== DETAILED SERVICES ANALYSIS ===');

const services = {
  'AuthService.ts': 'Аутентификация и пользователи',
  'HeroService.ts': 'Герои Mobile Legends', 
  'BuildService.ts': 'Сборки и билды',
  'SocialService.ts': 'Социальные функции',
  'socketService.ts': 'WebSocket и реальное время'
};

Object.entries(services).forEach(([filename, description]) => {
  const filepath = path.join('src/services', filename);
  console.log(`\n🎯 ${filename} - ${description}`);
  
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Анализ класса и методов
    const classMatch = content.match(/export class (\w+)/);
    if (classMatch) {
      console.log(`   Класс: ${classMatch[1]}`);
    }
    
    // Поиск методов
    const methods = content.match(/async\s+(\w+)\s*\([^)]*\)/g) || [];
    console.log(`   Методы: ${methods.slice(0, 8).map(m => m.split('(')[0].replace('async ', '')).join(', ')}`);
    
    // Поиск проблем
    const problems = [];
    if (content.includes('FIXME') || content.includes('TODO') || content.includes('BUG')) problems.push('найдены FIXME/TODO');
    if (content.includes('any)')) problems.push('используется any тип');
    if (content.match(/console\.log/g)?.length > 5) problems.push('много console.log');
    
    if (problems.length > 0) {
      console.log(`   🚨 Проблемы: ${problems.join(', ')}`);
    } else {
      console.log(`   ✅ Проблем не найдено`);
    }
    
    // ML-специфичный анализ
    if (filename === 'HeroService.ts') {
      if (content.includes('HeroRole') && content.includes('getHeroesByRole')) {
        console.log(`   ✅ Есть ML-специфичная логика (роли героев)`);
      } else {
        console.log(`   ❌ Не хватает ML-логики`);
      }
    }
    
    if (filename === 'BuildService.ts') {
      if (content.includes('playstyle') || content.includes('winRate')) {
        console.log(`   ✅ Есть ML-статистика сборок`);
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Файл не найден или ошибка чтения`);
  }
});

console.log('\n=== РЕКОМЕНДАЦИИ ПО СЕРВИСАМ ===');
console.log('1. HeroService - добавить больше ML-данных (скиллы, характеристики)');
console.log('2. BuildService - улучшить систему рейтинга сборок');
console.log('3. SocialService - добавить ML-тематические группы');
console.log('4. AuthService - добавить привязку к игровому аккаунту ML');
console.log('5. SocketService - добавить реальные игровые события');
