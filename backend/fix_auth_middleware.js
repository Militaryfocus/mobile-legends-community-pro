const fs = require('fs');
const path = require('path');

const filePath = './src/middleware/authMiddleware.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Find the position to insert cookie support
const insertPosition = content.lastIndexOf('}');

// Cookie authentication function
const cookieFunction = `

// Cookie-based authentication support
export const authenticateTokenWithCookie = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(' ')[1];

    // If no header token, check cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AuthMiddlewareError('Access token required', 401);
    }

    const payload = await authService.validateToken(token);
    req.user = payload;
    
    next();
  } catch (error) {
    next(new AuthMiddlewareError('Invalid or expired token', 401));
  }
};
`;

// Update main authenticateToken to support cookies
let updatedContent = content.replace(
  /const token = authHeader && authHeader\.split\(' '\)\[1\];/,
  `let token = authHeader && authHeader.split(' ')[1];

    // If no header token, check cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }`
);

// Insert cookie function at the end
updatedContent = updatedContent.slice(0, insertPosition) + cookieFunction + updatedContent.slice(insertPosition);

fs.writeFileSync(filePath, updatedContent);
console.log('✅ AuthMiddleware updated successfully');
