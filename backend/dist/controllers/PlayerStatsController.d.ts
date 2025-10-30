import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class PlayerStatsController {
    getPlayerStats(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getHeroStats(req: Request, res: Response): Promise<void>;
    getRankProgress(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updatePlayerStats(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPlayerComparison(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getLeaderboard(req: Request, res: Response): Promise<void>;
}
export declare const playerStatsController: PlayerStatsController;
//# sourceMappingURL=PlayerStatsController.d.ts.map