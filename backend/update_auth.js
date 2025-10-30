const fs = require('fs');

const authControllerPath = './src/controllers/AuthController.ts';
let content = fs.readFileSync(authControllerPath, 'utf8');

// Update login method to set cookies
const updatedLogin = `
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password
      });

      // Set HTTP-only cookies
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }`;

// Update logout method to clear cookies
const updatedLogout = `
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (req.user && token) {
        await authService.logout(req.user.userId, token);
      }

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }`;

// Update refreshToken to set new cookies
const updatedRefreshToken = `
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new AuthError('Refresh token required', 401);
      }

      const result = await authService.refreshToken(refreshToken);

      // Set new cookies
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', 
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        data: {
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }`;

// Replace methods in content
content = content.replace(/async login\([^}]+?}\s*}/s, updatedLogin);
content = content.replace(/async logout\([^}]+?}\s*}/s, updatedLogout);
content = content.replace(/async refreshToken\([^}]+?}\s*}/s, updatedRefreshToken);

fs.writeFileSync(authControllerPath, content);
console.log('✅ AuthController updated with cookie support');
