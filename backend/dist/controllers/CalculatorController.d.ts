import { Request, Response } from 'express';
export declare class CalculatorController {
    calculateBuild(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    compareBuilds(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOptimalBuild(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSynergyRecommendations(req: Request, res: Response): Promise<void>;
}
export declare const calculatorController: CalculatorController;
//# sourceMappingURL=CalculatorController.d.ts.map