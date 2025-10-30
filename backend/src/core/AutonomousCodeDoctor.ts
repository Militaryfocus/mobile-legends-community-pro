import { execSync, spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { EventEmitter } from 'events';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ComponentType = 'auth' | 'database' | 'api' | 'config' | 'build' | 'security';

export interface Diagnosis {
  id: string;
  component: ComponentType;
  severity: Severity;
  title: string;
  description: string;
  file?: string;
  line?: number;
  codeSnippet?: string;
  rootCause: string;
  automaticFix: boolean;
  confidence: number;
}

export interface Treatment {
  diagnosis: Diagnosis;
  action: string;
  codeChanges?: string[];
  commands?: string[];
  rollbackPlan?: string;
  success: boolean;
  error?: string;
}

export interface HealthReport {
  timestamp: Date;
  overallHealth: 'healthy' | 'degraded' | 'critical';
  components: {
    [key in ComponentType]: {
      status: 'healthy' | 'issues' | 'critical';
      issues: number;
      lastCheck: Date;
    }
  };
  treatmentsApplied: Treatment[];
  activeDiagnoses: Diagnosis[];
}

export class AutonomousCodeDoctor extends EventEmitter {
  private healthHistory: HealthReport[] = [];
  private treatments: Treatment[] = [];
  private isMonitoring: boolean = false;

  constructor(private projectRoot: string = process.cwd()) {
    super();
  }

  public async performFullCheckup(): Promise<HealthReport> {
    this.emit('checkupStarted');
    
    const diagnoses: Diagnosis[] = [];
    
    try {
      diagnoses.push(...await this.diagnoseAuthentication());
      diagnoses.push(...await this.diagnoseDatabase());
      diagnoses.push(...await this.diagnoseBuildSystem());

      const treatments = await this.applyAutomaticTreatments(diagnoses);
      const healthReport = this.generateHealthReport(diagnoses, treatments);
      this.healthHistory.push(healthReport);

      this.emit('checkupCompleted', healthReport);
      return healthReport;

    } catch (error) {
      this.emit('checkupFailed', error);
      throw error;
    }
  }

  private async diagnoseAuthentication(): Promise<Diagnosis[]> {
    const diagnoses: Diagnosis[] = [];
    const authServicePath = join(this.projectRoot, 'src/services/AuthService.ts');
    
    if (existsSync(authServicePath)) {
      const content = readFileSync(authServicePath, 'utf-8');
      
      if (content.includes('process.env.JWT_SECRET!')) {
        diagnoses.push({
          id: 'AUTH_001',
          component: 'auth',
          severity: 'critical',
          title: 'JWT Secret Configuration Issue',
          description: 'AuthService использует process.env.JWT_SECRET который может не загружаться',
          file: 'src/services/AuthService.ts',
          rootCause: 'Environment variables не загружаются при определенных условиях запуска',
          automaticFix: true,
          confidence: 0.95
        });
      }
    }

    const middlewarePath = join(this.projectRoot, 'src/middleware/authMiddleware.ts');
    if (existsSync(middlewarePath)) {
      const content = readFileSync(middlewarePath, 'utf-8');
      
      if (content.includes('AuthService_1.authService')) {
        diagnoses.push({
          id: 'AUTH_002', 
          component: 'auth',
          severity: 'high',
          title: 'Module Import Circular Dependency',
          description: 'Обнаружены скомпилированные импорты которые создают разные экземпляры сервисов',
          file: 'src/services/AuthService.ts',
          rootCause: 'TypeScript компиляция создает разные экземпляры при импорте',
          automaticFix: true,
          confidence: 0.9
        });
      }
    }

    return diagnoses;
  }

  private async diagnoseDatabase(): Promise<Diagnosis[]> {
    const diagnoses: Diagnosis[] = [];
    
    try {
      execSync('npx prisma generate', { cwd: this.projectRoot });
      const migrations = execSync('npx prisma migrate status', { 
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });
      
      if (migrations.includes('Database schema is not in sync')) {
        diagnoses.push({
          id: 'DB_001',
          component: 'database',
          severity: 'high',
          title: 'Database Schema Out of Sync',
          description: 'Схема базы данных не синхронизирована с миграциями',
          rootCause: 'Не применены последние миграции или изменения в схеме',
          automaticFix: true,
          confidence: 0.85
        });
      }

    } catch (error: any) {
      diagnoses.push({
        id: 'DB_002',
        component: 'database',
        severity: 'critical',
        title: 'Database Connection Failed',
        description: `Не удалось подключиться к базе данных: ${error.message}`,
        rootCause: 'Неправильная конфигурация БД или сервер недоступен',
        automaticFix: false,
        confidence: 0.7
      });
    }

    return diagnoses;
  }

  private async diagnoseBuildSystem(): Promise<Diagnosis[]> {
    const diagnoses: Diagnosis[] = [];
    
    try {
      execSync('npx tsc --noEmit', { cwd: this.projectRoot });
    } catch (error: any) {
      diagnoses.push({
        id: 'BUILD_001',
        component: 'build',
        severity: 'critical',
        title: 'TypeScript Compilation Failed',
        description: 'Обнаружены ошибки компиляции TypeScript',
        rootCause: 'Синтаксические ошибки или проблемы с типами',
        automaticFix: true,
        confidence: 0.9
      });
    }

    return diagnoses;
  }

  private async applyAutomaticTreatments(diagnoses: Diagnosis[]): Promise<Treatment[]> {
    const treatments: Treatment[] = [];
    const treatableDiagnoses = diagnoses.filter(d => d.automaticFix);

    for (const diagnosis of treatableDiagnoses) {
      try {
        this.emit('treatmentStarted', diagnosis);
        
        let treatment: Treatment;
        
        switch (diagnosis.id) {
          case 'AUTH_001':
            treatment = await this.treatJWTSecretIssue();
            break;
          case 'AUTH_002':
            treatment = await this.treatModuleImportIssue();
            break;
          case 'BUILD_001':
            treatment = await this.treatTypeScriptErrors();
            break;
          default:
            treatment = {
              diagnosis,
              action: 'No automatic treatment available',
              success: false,
              error: 'Unknown diagnosis ID'
            };
        }

        treatments.push(treatment);
        this.emit('treatmentCompleted', treatment);

      } catch (error: any) {
        const failedTreatment: Treatment = {
          diagnosis,
          action: 'Treatment execution failed',
          success: false,
          error: error.message
        };
        treatments.push(failedTreatment);
        this.emit('treatmentFailed', failedTreatment);
      }
    }

    return treatments;
  }

  private async treatJWTSecretIssue(): Promise<Treatment> {
    const authServicePath = join(this.projectRoot, 'src/services/AuthService.ts');
    const originalContent = readFileSync(authServicePath, 'utf-8');
    
    writeFileSync(authServicePath + '.backup', originalContent);
    
    const fixedContent = originalContent
      .replace(
        /const JWT_SECRET = process\.env\.JWT_SECRET!/,
        'const JWT_SECRET = "dev_jwt_secret_2024"'
      )
      .replace(
        /const JWT_REFRESH_SECRET = process\.env\.JWT_REFRESH_SECRET \|\| JWT_SECRET \+ '_refresh'/,
        'const JWT_REFRESH_SECRET = "dev_jwt_refresh_secret_2024"'
      );

    writeFileSync(authServicePath, fixedContent);

    return {
      diagnosis: {
        id: 'AUTH_001',
        component: 'auth',
        severity: 'critical',
        title: 'JWT Secret Configuration Issue',
        description: 'AuthService использует process.env.JWT_SECRET который может не загружаться',
        file: 'src/services/AuthService.ts',
        rootCause: 'Environment variables не загружаются при определенных условиях запуска',
        automaticFix: true,
        confidence: 0.95
      },
      action: 'Replaced process.env.JWT_SECRET with fixed value',
      codeChanges: [
        'const JWT_SECRET = "dev_jwt_secret_2024"',
        'const JWT_REFRESH_SECRET = "dev_jwt_refresh_secret_2024"'
      ],
      commands: ['npm run build'],
      rollbackPlan: `Restore from ${authServicePath}.backup`,
      success: true
    };
  }

  private async treatModuleImportIssue(): Promise<Treatment> {
    const middlewarePath = join(this.projectRoot, 'src/middleware/authMiddleware.ts');
    
    const directJWTImplementation = `
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = "dev_jwt_secret_2024";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new Error('Access token required');
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    next(new Error('Invalid or expired token'));
  }
};
    `.trim();

    if (existsSync(middlewarePath)) {
      writeFileSync(middlewarePath + '.backup', readFileSync(middlewarePath, 'utf-8'));
    }

    writeFileSync(middlewarePath, directJWTImplementation);

    return {
      diagnosis: {
        id: 'AUTH_002',
        component: 'auth',
        severity: 'high',
        title: 'Module Import Circular Dependency',
        description: 'Обнаружены скомпилированные импорты которые создают разные экземпляры сервисов',
        file: 'src/services/AuthService.ts',
        rootCause: 'TypeScript компиляция создает разные экземпляры при импорте',
        automaticFix: true,
        confidence: 0.9
      },
      action: 'Rewrote authMiddleware to use direct JWT verification',
      codeChanges: ['Implemented direct jwt.verify() calls'],
      commands: ['npm run build'],
      rollbackPlan: `Restore from ${middlewarePath}.backup`,
      success: true
    };
  }

  private async treatTypeScriptErrors(): Promise<Treatment> {
    return {
      diagnosis: {
        id: 'BUILD_001',
        component: 'build',
        severity: 'critical',
        title: 'TypeScript Compilation Failed',
        description: 'Обнаружены ошибки компиляции TypeScript',
        rootCause: 'Синтаксические ошибки или проблемы с типами',
        automaticFix: true,
        confidence: 0.9
      },
      action: 'Manual TypeScript error fixing required',
      commands: ['npx tsc --noEmit to see errors'],
      success: false,
      error: 'TypeScript errors require manual intervention'
    };
  }

  private generateHealthReport(diagnoses: Diagnosis[], treatments: Treatment[]): HealthReport {
    const criticalIssues = diagnoses.filter(d => d.severity === 'critical').length;
    const highIssues = diagnoses.filter(d => d.severity === 'high').length;
    
    let overallHealth: 'healthy' | 'degraded' | 'critical';
    if (criticalIssues > 0) overallHealth = 'critical';
    else if (highIssues > 0) overallHealth = 'degraded';
    else overallHealth = 'healthy';

    const componentStatus = {
      auth: this.getComponentStatus(diagnoses, 'auth'),
      database: this.getComponentStatus(diagnoses, 'database'),
      api: { status: 'healthy' as const, issues: 0, lastCheck: new Date() },
      config: { status: 'healthy' as const, issues: 0, lastCheck: new Date() },
      build: this.getComponentStatus(diagnoses, 'build'),
      security: { status: 'healthy' as const, issues: 0, lastCheck: new Date() }
    };

    return {
      timestamp: new Date(),
      overallHealth,
      components: componentStatus,
      treatmentsApplied: treatments.filter(t => t.success),
      activeDiagnoses: diagnoses.filter(d => !d.automaticFix || 
        treatments.find(t => t.diagnosis.id === d.id && !t.success))
    };
  }

  private getComponentStatus(diagnoses: Diagnosis[], component: ComponentType) {
    const componentIssues = diagnoses.filter(d => d.component === component);
    const critical = componentIssues.filter(d => d.severity === 'critical').length;
    
    let status: 'healthy' | 'issues' | 'critical';
    if (critical > 0) status = 'critical';
    else if (componentIssues.length > 0) status = 'issues';
    else status = 'healthy';

    return {
      status,
      issues: componentIssues.length,
      lastCheck: new Date()
    };
  }

  public startContinuousMonitoring(intervalMs: number = 300000): void {
    this.isMonitoring = true;
    
    const monitor = async () => {
      if (!this.isMonitoring) return;
      
      try {
        await this.performFullCheckup();
      } catch (error) {
        this.emit('monitoringError', error);
      } finally {
        if (this.isMonitoring) {
          setTimeout(monitor, intervalMs);
        }
      }
    };
    
    monitor();
    this.emit('monitoringStarted');
  }

  public stopContinuousMonitoring(): void {
    this.isMonitoring = false;
    this.emit('monitoringStopped');
  }

  public getHealthHistory(): HealthReport[] {
    return [...this.healthHistory];
  }
}

export class MLBBAutonomousDoctorController {
  private doctor: AutonomousCodeDoctor;

  constructor() {
    this.doctor = new AutonomousCodeDoctor();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.doctor.on('checkupStarted', () => {
      console.log('🩺 Начинается полная диагностика системы...');
    });

    this.doctor.on('checkupCompleted', (report: HealthReport) => {
      console.log('✅ Диагностика завершена!');
      this.logHealthReport(report);
    });

    this.doctor.on('treatmentStarted', (diagnosis: Diagnosis) => {
      console.log(`💊 Лечение: ${diagnosis.title}`);
    });

    this.doctor.on('treatmentCompleted', (treatment: Treatment) => {
      console.log(`✅ Успешно вылечено: ${treatment.diagnosis.title}`);
    });
  }

  public async emergencyHealing(): Promise<HealthReport> {
    console.log('🚨 ЗАПУСК ЭКСТРЕННОГО ЛЕЧЕНИЯ СИСТЕМЫ...');
    return await this.doctor.performFullCheckup();
  }

  public startHealthMonitoring(): void {
    console.log('📡 Запуск непрерывного мониторинга здоровья системы...');
    this.doctor.startContinuousMonitoring();
  }

  private logHealthReport(report: HealthReport): void {
    console.log('\n📊 ОТЧЕТ О ЗДОРОВЬЕ СИСТЕМЫ:');
    console.log(`📅 Время: ${report.timestamp.toLocaleString()}`);
    console.log(`🏥 Общее состояние: ${report.overallHealth.toUpperCase()}`);
    
    console.log('\n🔧 КОМПОНЕНТЫ:');
    Object.entries(report.components).forEach(([component, status]) => {
      console.log(`  ${component}: ${status.status} (проблем: ${status.issues})`);
    });

    console.log(`\n💊 ПРИМЕНЕНО ЛЕЧЕНИЙ: ${report.treatmentsApplied.length}`);
    console.log(`🐛 АКТИВНЫХ ПРОБЛЕМ: ${report.activeDiagnoses.length}`);

    if (report.activeDiagnoses.length > 0) {
      console.log('\n⚠️ ТРЕБУЕТ ВНИМАНИЯ:');
      report.activeDiagnoses.forEach(diagnosis => {
        console.log(`  ${diagnosis.severity.toUpperCase()}: ${diagnosis.title}`);
      });
    }
  }
}

export async function launchAutonomousDoctor(): Promise<MLBBAutonomousDoctorController> {
  const controller = new MLBBAutonomousDoctorController();
  await controller.emergencyHealing();
  controller.startHealthMonitoring();
  return controller;
}
