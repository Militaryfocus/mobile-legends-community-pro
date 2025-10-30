"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateRefreshToken = exports.validateLogin = exports.validateRegister = exports.ValidationError = void 0;
const express_validator_1 = require("express-validator");
class ValidationError extends Error {
    constructor(message, statusCode = 400, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
exports.validateRegister = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers and underscores')
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.validateRefreshToken = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ValidationError(`Validation failed: ${errorMessages.join(', ')}`, 400, {
            details: errors.array()
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
//# sourceMappingURL=validationMiddleware.js.map