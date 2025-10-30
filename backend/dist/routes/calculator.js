"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CalculatorController_1 = require("../controllers/CalculatorController");
const router = (0, express_1.Router)();
router.post('/calculate', CalculatorController_1.calculatorController.calculateBuild);
router.post('/compare', CalculatorController_1.calculatorController.compareBuilds);
router.get('/optimal', CalculatorController_1.calculatorController.getOptimalBuild);
router.post('/synergies', CalculatorController_1.calculatorController.getSynergyRecommendations);
exports.default = router;
//# sourceMappingURL=calculator.js.map