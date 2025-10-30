const fs = require('fs');

console.log('🎮 ДОБАВЛЕНИЕ ML ENDPOINTS ДЛЯ HEROES\\n');

// Читаем текущий HeroController
const heroControllerPath = 'src/controllers/HeroController.ts';
let heroController = fs.readFileSync(heroControllerPath, 'utf8');

// Добавляем новые методы в контроллер
const improvedHeroController = heroController.replace(
  'export const heroController = {',
  `export const heroController = {
  // Новые ML-специфичные методы
  
  async getHeroSkills(req: any, res: any) {
    try {
      const { id } = req.params;
      const skills = await heroService.getHeroSkills(id);
      res.json({ success: true, data: skills });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getHeroCounters(req: any, res: any) {
    try {
      const { id } = req.params;
      const counters = await heroService.getHeroCounters(id);
      res.json({ success: true, data: counters });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getHeroWinRates(req: any, res: any) {
    try {
      const { id } = req.params;
      const { timeframe = 'month' } = req.query;
      const winRates = await heroService.getHeroWinRates(id, timeframe);
      res.json({ success: true, data: winRates });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getPopularHeroes(req: any, res: any) {
    try {
      const { role, limit = 10 } = req.query;
      const heroes = await heroService.getPopularHeroes(role, parseInt(limit));
      res.json({ success: true, data: heroes });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getMetaTierList(req: any, res: any) {
    try {
      const tierList = await heroService.getMetaTierList();
      res.json({ success: true, data: tierList });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },`
);

fs.writeFileSync('src/controllers/HeroController.improved.ts', improvedHeroController);
console.log('✅ УЛУЧШЕННЫЙ КОНТРОЛЛЕР: src/controllers/HeroController.improved.ts');

// Теперь обновляем роуты
const heroRoutesPath = 'src/routes/heroes.ts';
let heroRoutes = fs.readFileSync(heroRoutesPath, 'utf8');

// Добавляем новые роуты
const improvedHeroRoutes = heroRoutes.replace(
  'router.get(\\'/meta\\', optionalAuth, heroController.getMetaStats);',
  `router.get('/meta', optionalAuth, heroController.getMetaStats);
router.get('/popular', optionalAuth, heroController.getPopularHeroes);
router.get('/tier-list', optionalAuth, heroController.getMetaTierList);
router.get('/:id/skills', optionalAuth, heroController.getHeroSkills);
router.get('/:id/counters', optionalAuth, heroController.getHeroCounters);
router.get('/:id/winrates', optionalAuth, heroController.getHeroWinRates);`
);

fs.writeFileSync('src/routes/heroes.improved.ts', improvedHeroRoutes);
console.log('✅ УЛУЧШЕННЫЕ РОУТЫ: src/routes/heroes.improved.ts');

console.log('\\n🎯 ДОБАВЛЕННЫЕ ENDPOINTS:');
console.log('GET /api/heroes/popular          - Популярные герои');
console.log('GET /api/heroes/tier-list        - Тирлист меты');
console.log('GET /api/heroes/:id/skills       - Скиллы героя');
console.log('GET /api/heroes/:id/counters     - Контрпики героя');
console.log('GET /api/heroes/:id/winrates     - Винрейты героя');
