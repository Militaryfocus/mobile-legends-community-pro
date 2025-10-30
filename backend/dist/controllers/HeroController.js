"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroController = exports.HeroController = void 0;
const HeroService_1 = require("../services/HeroService");
class HeroController {
    async getAllHeroes(req, res) {
        try {
            const { role, difficulty, lane, search } = req.query;
            const filters = {
                role: role,
                difficulty: difficulty ? parseInt(difficulty) : undefined,
                lane: lane,
                search: req.query.search
            };
            const heroes = await HeroService_1.heroService.getAllHeroes(filters);
            res.json({
                success: true,
                data: heroes
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getHeroById(req, res) {
        try {
            const { id } = req.params;
            const hero = await HeroService_1.heroService.getHeroById(id);
            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                });
            }
            res.json({
                success: true,
                data: hero
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getHeroesByRole(req, res) {
        try {
            const { role } = req.params;
            const heroes = await HeroService_1.heroService.getHeroesByRole(role);
            res.json({
                success: true,
                data: heroes
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getHeroMetaStats(req, res) {
        try {
            const stats = await HeroService_1.heroService.getHeroMetaStats();
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getHeroSkills(req, res) {
        try {
            const { id } = req.params;
            const skills = await HeroService_1.heroService.getHeroSkills(id);
            res.json({
                success: true,
                data: skills
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getHeroCounters(req, res) {
        try {
            const { id } = req.params;
            const counters = await HeroService_1.heroService.getHeroCounters(id);
            res.json({
                success: true,
                data: counters
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getPopularHeroes(req, res) {
        try {
            const { role, limit } = req.query;
            const heroes = await HeroService_1.heroService.getPopularHeroes(role, limit ? parseInt(limit) : 10);
            res.json({
                success: true,
                data: heroes
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getMetaTierList(req, res) {
        try {
            const tierList = await HeroService_1.heroService.getMetaTierList();
            res.json({
                success: true,
                data: tierList
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
exports.HeroController = HeroController;
exports.heroController = new HeroController();
//# sourceMappingURL=HeroController.js.map