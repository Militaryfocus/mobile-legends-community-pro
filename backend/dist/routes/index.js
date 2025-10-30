"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const heroes_1 = __importDefault(require("./heroes"));
const builds_1 = __importDefault(require("./builds"));
const stats_1 = __importDefault(require("./stats"));
const calculator_1 = __importDefault(require("./calculator"));
const router = (0, express_1.Router)();
router.use('/api/auth', auth_1.default);
router.use('/api/heroes', heroes_1.default);
router.use('/api/builds', builds_1.default);
router.use('/api/stats', stats_1.default);
router.use('/api/calculator', calculator_1.default);
router.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map