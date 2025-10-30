"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/heroes.ts
const express_1 = require("express");
const HeroController_1 = require("../controllers/HeroController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', authMiddleware_1.optionalAuth, HeroController_1.heroController.getAllHeroes);
router.get('/search', authMiddleware_1.optionalAuth, HeroController_1.heroController.getAllHeroes);
router.get('/meta', authMiddleware_1.optionalAuth, HeroController_1.heroController.getHeroMetaStats);
router.get('/role/:role', authMiddleware_1.optionalAuth, HeroController_1.heroController.getHeroesByRole);
router.get('/:id', authMiddleware_1.optionalAuth, HeroController_1.heroController.getHeroById);
exports.default = router;
//# sourceMappingURL=heroes.js.map