const fs = require('fs');
const filePath = './src/server.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Add debug route before health check
const debugRoute = `
// Debug route for token validation
app.get('/api/debug/token', (req, res) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret_2024');
    res.json({ 
      valid: true, 
      decoded,
      secretUsed: process.env.JWT_SECRET 
    });
  } catch (error) {
    res.json({ 
      valid: false, 
      error: error.message,
      secretUsed: process.env.JWT_SECRET 
    });
  }
});
`;

content = content.replace('// Health check', debugRoute + '\n// Health check');
fs.writeFileSync(filePath, content);
console.log('✅ Debug route added to server.ts');
