"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatorController = exports.CalculatorController = void 0;
const CalculatorService_1 = require("../services/CalculatorService");
class CalculatorController {
    async calculateBuild(req, res) {
        try {
            const { items, emblems, heroId, level = 15, spell1, spell2 } = req.body;
            if (!heroId || !items) {
                return res.status(400).json({
                    success: false,
                    message: 'Hero ID and items are required'
                });
            }
            const result = await CalculatorService_1.calculatorService.calculateBuild({
                items,
                emblems: emblems || [],
                heroId,
                level: parseInt(level),
                spell1,
                spell2
            });
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async compareBuilds(req, res) {
        try {
            const { build1, build2 } = req.body;
            if (!build1 || !build2) {
                return res.status(400).json({
                    success: false,
                    message: 'Both builds are required for comparison'
                });
            }
            const result = await CalculatorService_1.calculatorService.compareBuilds(build1, build2);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getOptimalBuild(req, res) {
        try {
            const { heroId, playstyle = 'BALANCED', budget = 20000 } = req.query;
            if (!heroId) {
                return res.status(400).json({
                    success: false,
                    message: 'Hero ID is required'
                });
            }
            const result = await CalculatorService_1.calculatorService.getOptimalBuild(heroId, playstyle, parseInt(budget));
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getSynergyRecommendations(req, res) {
        try {
            const { heroId, currentItems } = req.body;
            // Временная реализация - возвращаем общие рекомендации
            const recommendations = [
                'Для марксменов: Blade of Despair + Windtalker',
                'Для магов: Lightning Truncheon + Divine Glaive',
                'Для танков: Antique Cuirass + Immortality',
                'Для ассассинов: Blade of Despair + Endless Battle'
            ];
            res.json({
                success: true,
                data: {
                    recommendations,
                    heroSpecific: [],
                    itemCombinations: []
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.CalculatorController = CalculatorController;
exports.calculatorController = new CalculatorController();
//# sourceMappingURL=CalculatorController.js.map