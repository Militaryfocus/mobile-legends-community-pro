const fs = require('fs');

let content = fs.readFileSync('src/services/AuthService.ts', 'utf8');

// Заменяем метод generateTokens
const newGenerateTokens = `  private async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
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
  }`;

// Заменяем старый метод
content = content.replace(
  /private async generateTokens\(userId: string\): Promise<{ accessToken: string; refreshToken: string }> \{[\\s\\S]*?return { accessToken, refreshToken };\n  \}/,
  newGenerateTokens
);

fs.writeFileSync('src/services/AuthService.ts', content);
console.log('✅ AuthService fixed with delete+create approach');
