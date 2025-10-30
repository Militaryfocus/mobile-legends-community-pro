const fs = require('fs');
const content = fs.readFileSync('src/services/AuthService.ts', 'utf8');

// Ищем метод generateTokens и заменяем только его тело
const newContent = content.replace(
  /(private async generateTokens\(userId: string\): Promise<\{ accessToken: string; refreshToken: string \}>\s*\{)[\s\S]*?(\n  \})/,
  `$1
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    // Удаляем старые сессии пользователя перед созданием новой
    await prisma.session.deleteMany({
      where: { userId }
    });

    // Сохраняем refresh token в сессии
    await prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
      }
    });

    return { accessToken, refreshToken };
  }`
);

fs.writeFileSync('src/services/AuthService.ts', newContent);
console.log('✅ generateTokens method fixed successfully');
