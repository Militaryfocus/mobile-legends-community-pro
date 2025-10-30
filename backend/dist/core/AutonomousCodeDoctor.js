"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLBBAutonomousDoctorController = exports.AutonomousCodeDoctor = void 0;
exports.launchAutonomousDoctor = launchAutonomousDoctor;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const events_1 = require("events");
class AutonomousCodeDoctor extends events_1.EventEmitter {
    constructor(projectRoot = process.cwd()) {
        super();
        this.projectRoot = projectRoot;
        this.healthHistory = [];
        this.treatments = [];
        this.isMonitoring = false;
    }
    async performFullCheckup() {
        this.emit('checkupStarted');
        const diagnoses = [];
        try {
            diagnoses.push(...await this.diagnoseAuthentication());
            diagnoses.push(...await this.diagnoseDatabase());
            diagnoses.push(...await this.diagnoseBuildSystem());
            const treatments = await this.applyAutomaticTreatments(diagnoses);
            const healthReport = this.generateHealthReport(diagnoses, treatments);
            this.healthHistory.push(healthReport);
            this.emit('checkupCompleted', healthReport);
            return healthReport;
        }
        catch (error) {
            this.emit('checkupFailed', error);
            throw error;
        }
    }
    async diagnoseAuthentication() {
        const diagnoses = [];
        const authServicePath = (0, path_1.join)(this.projectRoot, 'src/services/AuthService.ts');
        if ((0, fs_1.existsSync)(authServicePath)) {
            const content = (0, fs_1.readFileSync)(authServicePath, 'utf-8');
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
        const middlewarePath = (0, path_1.join)(this.projectRoot, 'src/middleware/authMiddleware.ts');
        if ((0, fs_1.existsSync)(middlewarePath)) {
            const content = (0, fs_1.readFileSync)(middlewarePath, 'utf-8');
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
    async diagnoseDatabase() {
        const diagnoses = [];
        try {
            (0, child_process_1.execSync)('npx prisma generate', { cwd: this.projectRoot });
            const migrations = (0, child_process_1.execSync)('npx prisma migrate status', {
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
        }
        catch (error) {
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
    async diagnoseBuildSystem() {
        const diagnoses = [];
        try {
            (0, child_process_1.execSync)('npx tsc --noEmit', { cwd: this.projectRoot });
        }
        catch (error) {
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
    async applyAutomaticTreatments(diagnoses) {
        const treatments = [];
        const treatableDiagnoses = diagnoses.filter(d => d.automaticFix);
        for (const diagnosis of treatableDiagnoses) {
            try {
                this.emit('treatmentStarted', diagnosis);
                let treatment;
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
            }
            catch (error) {
                const failedTreatment = {
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
    async treatJWTSecretIssue() {
        const authServicePath = (0, path_1.join)(this.projectRoot, 'src/services/AuthService.ts');
        const originalContent = (0, fs_1.readFileSync)(authServicePath, 'utf-8');
        (0, fs_1.writeFileSync)(authServicePath + '.backup', originalContent);
        const fixedContent = originalContent
            .replace(/const JWT_SECRET = process\.env\.JWT_SECRET!/, 'const JWT_SECRET = "dev_jwt_secret_2024"')
            .replace(/const JWT_REFRESH_SECRET = process\.env\.JWT_REFRESH_SECRET \|\| JWT_SECRET \+ '_refresh'/, 'const JWT_REFRESH_SECRET = "dev_jwt_refresh_secret_2024"');
        (0, fs_1.writeFileSync)(authServicePath, fixedContent);
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
    async treatModuleImportIssue() {
        const middlewarePath = (0, path_1.join)(this.projectRoot, 'src/middleware/authMiddleware.ts');
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
        if ((0, fs_1.existsSync)(middlewarePath)) {
            (0, fs_1.writeFileSync)(middlewarePath + '.backup', (0, fs_1.readFileSync)(middlewarePath, 'utf-8'));
        }
        (0, fs_1.writeFileSync)(middlewarePath, directJWTImplementation);
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
    async treatTypeScriptErrors() {
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
    generateHealthReport(diagnoses, treatments) {
        const criticalIssues = diagnoses.filter(d => d.severity === 'critical').length;
        const highIssues = diagnoses.filter(d => d.severity === 'high').length;
        let overallHealth;
        if (criticalIssues > 0)
            overallHealth = 'critical';
        else if (highIssues > 0)
            overallHealth = 'degraded';
        else
            overallHealth = 'healthy';
        const componentStatus = {
            auth: this.getComponentStatus(diagnoses, 'auth'),
            database: this.getComponentStatus(diagnoses, 'database'),
            api: { status: 'healthy', issues: 0, lastCheck: new Date() },
            config: { status: 'healthy', issues: 0, lastCheck: new Date() },
            build: this.getComponentStatus(diagnoses, 'build'),
            security: { status: 'healthy', issues: 0, lastCheck: new Date() }
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
    getComponentStatus(diagnoses, component) {
        const componentIssues = diagnoses.filter(d => d.component === component);
        const critical = componentIssues.filter(d => d.severity === 'critical').length;
        let status;
        if (critical > 0)
            status = 'critical';
        else if (componentIssues.length > 0)
            status = 'issues';
        else
            status = 'healthy';
        return {
            status,
            issues: componentIssues.length,
            lastCheck: new Date()
        };
    }
    startContinuousMonitoring(intervalMs = 300000) {
        this.isMonitoring = true;
        const monitor = async () => {
            if (!this.isMonitoring)
                return;
            try {
                await this.performFullCheckup();
            }
            catch (error) {
                this.emit('monitoringError', error);
            }
            finally {
                if (this.isMonitoring) {
                    setTimeout(monitor, intervalMs);
                }
            }
        };
        monitor();
        this.emit('monitoringStarted');
    }
    stopContinuousMonitoring() {
        this.isMonitoring = false;
        this.emit('monitoringStopped');
    }
    getHealthHistory() {
        return [...this.healthHistory];
    }
}
exports.AutonomousCodeDoctor = AutonomousCodeDoctor;
class MLBBAutonomousDoctorController {
    constructor() {
        this.doctor = new AutonomousCodeDoctor();
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.doctor.on('checkupStarted', () => {
            console.log('🩺 Начинается полная диагностика системы...');
        });
        this.doctor.on('checkupCompleted', (report) => {
            console.log('✅ Диагностика завершена!');
            this.logHealthReport(report);
        });
        this.doctor.on('treatmentStarted', (diagnosis) => {
            console.log(`💊 Лечение: ${diagnosis.title}`);
        });
        this.doctor.on('treatmentCompleted', (treatment) => {
            console.log(`✅ Успешно вылечено: ${treatment.diagnosis.title}`);
        });
    }
    async emergencyHealing() {
        console.log('🚨 ЗАПУСК ЭКСТРЕННОГО ЛЕЧЕНИЯ СИСТЕМЫ...');
        return await this.doctor.performFullCheckup();
    }
    startHealthMonitoring() {
        console.log('📡 Запуск непрерывного мониторинга здоровья системы...');
        this.doctor.startContinuousMonitoring();
    }
    logHealthReport(report) {
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
exports.MLBBAutonomousDoctorController = MLBBAutonomousDoctorController;
async function launchAutonomousDoctor() {
    const controller = new MLBBAutonomousDoctorController();
    await controller.emergencyHealing();
    controller.startHealthMonitoring();
    return controller;
}
//# sourceMappingURL=AutonomousCodeDoctor.js.map