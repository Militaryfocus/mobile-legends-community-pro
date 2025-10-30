const fs = require('fs');
const content = fs.readFileSync('src/services/AuthService.ts', 'utf8');

// Находим и заменяем метод generateTokens
const lines = content.split('\n');
let newContent = [];
let inMethod = false;
let methodReplaced = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('private async generateTokens(userId: string)')) {
    inMethod = true;
    methodReplaced = true;
    newContent.push('  private async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {');
    newContent.push('    const accessToken = this.generateAccessToken(userId);');
    newContent.push('    const refreshToken = this.generateRefreshToken(userId);');
    newContent.push('');
    newContent.push('    // Удаляем старые сессии пользователя перед созданием новой');
    newContent.push('    await prisma.session.deleteMany({');
    newContent.push('      where: { userId }');
    newContent.push('    });');
    newContent.push('');
    newContent.push('    // Сохраняем refresh token в сессии');
    newContent.push('    await prisma.session.create({');
    newContent.push('      data: {');
    newContent.push('        userId,');
    newContent.push('        token: refreshToken,');
    newContent.push('        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней');
    newContent.push('      }');
    newContent.push('    });');
    newContent.push('');
    newContent.push('    return { accessToken, refreshToken };');
    newContent.push('  }');
    
    // Пропускаем старый метод
    while (i < lines.length && !lines[i].trim().startsWith('private generateAccessToken')) {
      i++;
    }
    i--; // Вернемся на одну строку назад
    continue;
  }
  
  if (!inMethod) {
    newContent.push(lines[i]);
  }
  
  // Сбрасываем флаг когда находим следующий метод
  if (inMethod && lines[i].trim().startsWith('private generateAccessToken')) {
    inMethod = false;
    newContent.push(lines[i]);
  }
}

if (!methodReplaced) {
  console.log('❌ Method not found');
  process.exit(1);
}

fs.writeFileSync('src/services/AuthService.ts', newContent.join('\n'));
console.log('✅ AuthService fixed successfully');
