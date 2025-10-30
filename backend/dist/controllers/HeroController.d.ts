import { Request, Response } from 'express';
export declare class HeroController {
    getAllHeroes(req: Request, res: Response): Promise<void>;
    getHeroById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getHeroesByRole(req: Request, res: Response): Promise<void>;
    getHeroMetaStats(req: Request, res: Response): Promise<void>;
    getHeroSkills(req: Request, res: Response): Promise<void>;
    getHeroCounters(req: Request, res: Response): Promise<void>;
    getPopularHeroes(req: Request, res: Response): Promise<void>;
    getMetaTierList(req: Request, res: Response): Promise<void>;
}
export declare const heroController: HeroController;
//# sourceMappingURL=HeroController.d.ts.map