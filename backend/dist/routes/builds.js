"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BuildController_1 = require("../controllers/BuildController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', BuildController_1.buildController.getAllBuilds);
router.get('/recommended', BuildController_1.buildController.getRecommendedBuilds);
router.get('/pro', BuildController_1.buildController.getProBuilds);
router.get('/:id', BuildController_1.buildController.getBuildById);
router.post('/', auth_1.authenticateToken, BuildController_1.buildController.createBuild);
router.put('/:id', auth_1.authenticateToken, BuildController_1.buildController.updateBuild);
router.delete('/:id', auth_1.authenticateToken, BuildController_1.buildController.deleteBuild);
router.post('/:id/vote', auth_1.authenticateToken, BuildController_1.buildController.voteBuild);
exports.default = router;
//# sourceMappingURL=builds.js.map