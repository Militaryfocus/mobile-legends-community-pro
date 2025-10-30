const fs = require('fs');

// Read the original file
const content = fs.readFileSync('./src/controllers/AuthController.ts', 'utf8');

// Simple replacement - find the login method and replace just the response part
const updatedContent = content.replace(
  /res\.json\(\{\s*success: true,\s*data: result\s*\}\);/,
  `// Set HTTP-only cookies
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
      });`
);

fs.writeFileSync('./src/controllers/AuthController.ts', updatedContent);
console.log('✅ AuthController updated successfully');
