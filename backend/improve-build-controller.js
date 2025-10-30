const fs = require('fs');

console.log('🔧 ДОБАВЛЕНИЕ ML ENDPOINTS ДЛЯ BUILDS\\n');

// Читаем текущий BuildController
const buildControllerPath = 'src/controllers/BuildController.ts';
let buildController = fs.readFileSync(buildControllerPath, 'utf8');

// Добавляем новые методы
const improvedBuildController = buildController.replace(
  'export const buildController = {',
  `export const buildController = {
  // Новые ML-специфичные методы
  
  async getBuildWinRate(req: any, res: any) {
    try {
      const { id } = req.params;
      const winRate = await buildService.getBuildWinRate(id);
      res.json({ success: true, data: { winRate } });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getRecommendedBuilds(req: any, res: any) {
    try {
      const { heroId, playstyle = 'BALANCED' } = req.query;
      if (!heroId) {
        return res.status(400).json({
          success: false,
          error: 'Hero ID is required'
        });
      }
      
      const builds = await buildService.getRecommendedBuilds(heroId, playstyle);
      res.json({ success: true, data: builds });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getProBuilds(req: any, res: any) {
    try {
      const { heroId } = req.query;
      if (!heroId) {
        return res.status(400).json({
          success: false,
          error: 'Hero ID is required'
        });
      }
      
      const builds = await buildService.getProBuilds(heroId);
      res.json({ success: true, data: builds });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async calculateBuildSynergy(req: any, res: any) {
    try {
      const { id } = req.params;
      const synergy = await buildService.calculateBuildSynergy(id);
      res.json({ success: true, data: { synergy } });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async updateBuildStats(req: any, res: any) {
    try {
      const { id } = req.params;
      const updatedBuild = await buildService.updateBuildStats(id);
      res.json({ success: true, data: updatedBuild });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },`
);

fs.writeFileSync('src/controllers/BuildController.improved.ts', improvedBuildController);
console.log('✅ УЛУЧШЕННЫЙ КОНТРОЛЛЕР: src/controllers/BuildController.improved.ts');

// Обновляем роуты builds
const buildRoutesPath = 'src/routes/builds.ts';
let buildRoutes = fs.readFileSync(buildRoutesPath, 'utf8');

// Добавляем новые роуты
const improvedBuildRoutes = buildRoutes.replace(
  'router.get(\\'/\\', buildController.getAllBuilds);',
  `router.get('/', buildController.getAllBuilds);
router.get('/recommended', buildController.getRecommendedBuilds);
router.get('/pro', buildController.getProBuilds);
router.get('/:id/winrate', buildController.getBuildWinRate);
router.get('/:id/synergy', buildController.calculateBuildSynergy);
router.patch('/:id/stats', buildController.updateBuildStats);`
);

fs.writeFileSync('src/routes/builds.improved.ts', improvedBuildRoutes);
console.log('✅ УЛУЧШЕННЫЕ РОУТЫ: src/routes/builds.improved.ts');

console.log('\\n🎯 ДОБАВЛЕННЫЕ ENDPOINTS:');
console.log('GET /api/builds/recommended      - Рекомендованные сборки');
console.log('GET /api/builds/pro              - Про-сборки');
console.log('GET /api/builds/:id/winrate      - Винрейт сборки');
console.log('GET /api/builds/:id/synergy      - Синергия сборки');
console.log('PATCH /api/builds/:id/stats      - Обновление статистики');
