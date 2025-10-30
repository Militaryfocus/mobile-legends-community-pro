"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildController = exports.BuildController = void 0;
const BuildService_1 = require("../services/BuildService");
class BuildController {
    async getAllBuilds(req, res) {
        try {
            const { heroId, authorId, playstyle, isPublic, page = '1', limit = '10' } = req.query;
            const filters = {
                heroId: heroId,
                authorId: authorId,
                playstyle: playstyle,
                isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
                page: Number(page),
                limit: Number(limit)
            };
            const builds = await BuildService_1.buildService.getBuilds(filters);
            res.json({
                success: true,
                data: builds.data,
                pagination: {
                    page: filters.page,
                    limit: filters.limit,
                    total: builds.data.length,
                    pages: Math.ceil(builds.data.length / filters.limit)
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
    async getBuildById(req, res) {
        try {
            const { id } = req.params;
            const build = await BuildService_1.buildService.getBuildById(id);
            if (!build) {
                return res.status(404).json({
                    success: false,
                    message: 'Build not found'
                });
            }
            res.json({
                success: true,
                data: build
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async createBuild(req, res) {
        if (!req.user)
            return res.status(401).json({ success: false, message: "User not authenticated" });
        try {
            const buildData = {
                ...req.body,
                authorId: req.user?.userId
            };
            const build = await BuildService_1.buildService.createBuild(buildData);
            res.status(201).json({
                success: true,
                message: 'Build created successfully',
                data: build
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async updateBuild(req, res) {
        if (!req.user)
            return res.status(401).json({ success: false, message: "User not authenticated" });
        try {
            const { id } = req.params;
            const build = await BuildService_1.buildService.updateBuild(id, req.body, req.user?.userId);
            res.json({
                success: true,
                message: 'Build updated successfully',
                data: build
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async deleteBuild(req, res) {
        if (!req.user)
            return res.status(401).json({ success: false, message: "User not authenticated" });
        try {
            const { id } = req.params;
            await BuildService_1.buildService.deleteBuild(id, req.user?.userId);
            res.json({
                success: true,
                message: 'Build deleted successfully'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async voteBuild(req, res) {
        if (!req.user)
            return res.status(401).json({ success: false, message: "User not authenticated" });
        try {
            const { id } = req.params;
            const { value } = req.body;
            const result = await BuildService_1.buildService.voteBuild({
                buildId: id,
                userId: req.user?.userId,
                value
            });
            res.json({
                success: true,
                message: 'Vote recorded successfully',
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getRecommendedBuilds(req, res) {
        try {
            const { heroId, playstyle = 'BALANCED' } = req.query;
            const builds = await BuildService_1.buildService.getRecommendedBuilds(heroId, playstyle);
            res.json({
                success: true,
                data: builds
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getProBuilds(req, res) {
        try {
            const { heroId } = req.query;
            const builds = await BuildService_1.buildService.getProBuilds(heroId);
            res.json({
                success: true,
                data: builds
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
exports.BuildController = BuildController;
exports.buildController = new BuildController();
//# sourceMappingURL=BuildController.js.map