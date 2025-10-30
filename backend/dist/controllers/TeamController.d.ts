import { AuthenticatedRequest } from "../middleware/auth";
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare class TeamController {
    getAllTeams(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    createTeam(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getTeamById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    joinTeam(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const teamController: TeamController;
//# sourceMappingURL=TeamController.d.ts.map