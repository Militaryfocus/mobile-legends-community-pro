const fs = require('fs');
const content = fs.readFileSync('src/services/AuthService.ts', 'utf8');

// Заменяем блок создания сессии в методе login
const newContent = content.replace(
  /(const token = this\.generateToken\(user\.id\);\s*)\/\/ Create session\s*await prisma\.session\.create\(\{[\s\S]*?expiresAt: new Date\(Date\.now\(\) \+ 7 \* 24 \* 60 \* 60 \* 1000\) \/\/ 7 days\s*\}\);/,
  `$1// Delete old sessions and create new one
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });
    
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });`
);

fs.writeFileSync('src/services/AuthService.ts', newContent);
console.log('✅ Login session fixed successfully');
