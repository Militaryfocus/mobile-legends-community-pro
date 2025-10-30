"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeamController_1 = require("../controllers/TeamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', TeamController_1.teamController.getAllTeams);
router.post('/', authMiddleware_1.authenticateToken, TeamController_1.teamController.createTeam);
router.get('/:id', TeamController_1.teamController.getTeamById);
router.post('/:id/join', authMiddleware_1.authenticateToken, TeamController_1.teamController.joinTeam);
exports.default = router;
//# sourceMappingURL=teams.js.map