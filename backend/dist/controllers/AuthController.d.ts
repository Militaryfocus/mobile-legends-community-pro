import { AuthenticatedRequest } from "../middleware/auth";
import { Response } from 'express';
export declare class AuthController {
    register(req: AuthenticatedRequest, res: Response): Promise<void>;
    login(req: AuthenticatedRequest, res: Response): Promise<void>;
    refreshToken(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProfile(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const authController: AuthController;
//# sourceMappingURL=AuthController.d.ts.map