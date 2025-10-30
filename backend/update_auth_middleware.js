const fs = require('fs');

const filePath = './src/middleware/authMiddleware.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Add the cookie authentication function before the last closing brace
const cookieAuthFunction = `

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

// Insert before the last closing brace
content = content.replace(/\}$/, cookieAuthFunction + '\n}');

fs.writeFileSync(filePath, content);
console.log('✅ AuthMiddleware updated with cookie support');
