import { Request, Response } from 'express';
import { calculatorService } from '../services/CalculatorService';

export class CalculatorController {
  async calculateBuild(req: Request, res: Response) {
    try {
      const { items, emblems, heroId, level = 15, spell1, spell2 } = req.body;

      if (!heroId || !items) {
        return res.status(400).json({
          success: false,
          message: 'Hero ID and items are required'
        });
      }

      const result = await calculatorService.calculateBuild({
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async compareBuilds(req: Request, res: Response) {
    try {
      const { build1, build2 } = req.body;

      if (!build1 || !build2) {
        return res.status(400).json({
          success: false,
          message: 'Both builds are required for comparison'
        });
      }

      const result = await calculatorService.compareBuilds(build1, build2);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getOptimalBuild(req: Request, res: Response) {
    try {
      const { heroId, playstyle = 'BALANCED', budget = 20000 } = req.query;

      if (!heroId) {
        return res.status(400).json({
          success: false,
          message: 'Hero ID is required'
        });
      }

      const result = await calculatorService.getOptimalBuild(
        heroId as string,
        playstyle as string,
        parseInt(budget as string)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSynergyRecommendations(req: Request, res: Response) {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const calculatorController = new CalculatorController();
