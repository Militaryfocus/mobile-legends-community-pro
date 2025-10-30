import { Request, Response, NextFunction } from 'express';
export declare class ValidationError extends Error {
    statusCode: number;
    details?: any;
    constructor(message: string, statusCode?: number, details?: any);
}
export declare const validateRegister: import("express-validator").ValidationChain[];
export declare const validateLogin: import("express-validator").ValidationChain[];
export declare const validateRefreshToken: import("express-validator").ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validationMiddleware.d.ts.map