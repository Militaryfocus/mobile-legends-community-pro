const fs = require('fs');

const filePath = './src/controllers/AuthController.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace login method with cookie support
const newLoginMethod = `async login(req: Request, res: Response, next: NextFunction) {
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

content = content.replace(/async login\([^}]+?}\s*}/s, newLoginMethod);
fs.writeFileSync(filePath, content);
console.log('✅ Login method updated with cookie support');
