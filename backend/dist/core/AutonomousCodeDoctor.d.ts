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
        };
    };
    treatmentsApplied: Treatment[];
    activeDiagnoses: Diagnosis[];
}
export declare class AutonomousCodeDoctor extends EventEmitter {
    private projectRoot;
    private healthHistory;
    private treatments;
    private isMonitoring;
    constructor(projectRoot?: string);
    performFullCheckup(): Promise<HealthReport>;
    private diagnoseAuthentication;
    private diagnoseDatabase;
    private diagnoseBuildSystem;
    private applyAutomaticTreatments;
    private treatJWTSecretIssue;
    private treatModuleImportIssue;
    private treatTypeScriptErrors;
    private generateHealthReport;
    private getComponentStatus;
    startContinuousMonitoring(intervalMs?: number): void;
    stopContinuousMonitoring(): void;
    getHealthHistory(): HealthReport[];
}
export declare class MLBBAutonomousDoctorController {
    private doctor;
    constructor();
    private setupEventListeners;
    emergencyHealing(): Promise<HealthReport>;
    startHealthMonitoring(): void;
    private logHealthReport;
}
export declare function launchAutonomousDoctor(): Promise<MLBBAutonomousDoctorController>;
//# sourceMappingURL=AutonomousCodeDoctor.d.ts.map