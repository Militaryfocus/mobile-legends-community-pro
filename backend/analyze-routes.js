const fs = require('fs');
const path = require('path');

console.log('🌐 CURRENT API ENDPOINTS ANALYSIS\\n');

const routesDir = 'src/routes/';
const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));

routeFiles.forEach(file => {
  const content = fs.readFileSync(path.join(routesDir, file), 'utf8');
  const routeName = file.replace('.ts', '');
  
  console.log(`📁 ${routeName.toUpperCase()} ROUTES:`);
  
  // Ищем все HTTP методы
  const routes = content.match(/router\\.(get|post|put|delete)\\([^)]*\\)/g) || [];
  
  routes.forEach(route => {
    const method = route.match(/router\\.(get|post|put|delete)/)[1].toUpperCase();
    const pathMatch = route.match(/['"]([^'"]+)['"]/);
    const path = pathMatch ? pathMatch[1] : 'unknown';
    
    console.log(`   ${method} ${path}`);
  });
  
  console.log('');
});

console.log('🚀 MISSING ML ENDPOINTS:');
console.log('GET    /api/heroes/:id/skills     - Скиллы героя');
console.log('GET    /api/heroes/:id/counters   - Контрпики героя');
console.log('GET    /api/metagame/current      - Текущая мета');
console.log('GET    /api/leaderboards/ranked   - Рейтинговые таблицы');
console.log('POST   /api/builds/:id/vote       - Голосование за сборку');
console.log('GET    /api/players/:id/stats     - Статистика игрока');
console.log('POST   /api/teams/apply           - Заявки в команды');
console.log('GET    /api/events/tournaments    - Турниры и события');
