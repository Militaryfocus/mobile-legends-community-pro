import { AuthenticatedRequest } from "../middleware/auth";
import { Response } from 'express';
export declare class BuildController {
    getAllBuilds(req: AuthenticatedRequest, res: Response): Promise<void>;
    getBuildById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createBuild(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateBuild(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteBuild(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    voteBuild(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getRecommendedBuilds(req: AuthenticatedRequest, res: Response): Promise<void>;
    getProBuilds(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export declare const buildController: BuildController;
//# sourceMappingURL=BuildController.d.ts.map