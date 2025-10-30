const fs = require('fs');

const filePath = './src/controllers/AuthController.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace login method with cookies
const newLogin = `async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password
      });

      // SET COOKIES
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
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }`;

content = content.replace(/async login\(req: Request[^}]+?}\s*}/s, newLogin);
fs.writeFileSync(filePath, content);
console.log('✅ Login method updated with cookies');
