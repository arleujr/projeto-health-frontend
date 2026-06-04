export interface PatientSummary {
  id: string;
  name: string;
  status: 'RED' | 'YELLOW' | 'GREEN';
  score: number;
  trigger: string | null;
  aiAnalysis?: string;
  aiMessage?: string;
  goal?: string;
  onboardingDate?: string;
}

export interface DashboardMetrics {
  totalActive: number;
  riskCount: number;
  averageHealthScore: number;
  mrr: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  patients: PatientSummary[];
}