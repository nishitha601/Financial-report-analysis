export type AppState = 'upload' | 'loading' | 'results' | 'error';

export interface FinancialMetrics {
  revenue: number;
  expenses: number;
  netIncome: number;
  profitMargin: number;
  assets: number;
  liabilities: number;
  equity: number;
}

export interface ChartDataPoint {
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

export interface FinancialReport {
  companyName: string;
  reportingPeriod: string;
  metrics: FinancialMetrics;
  chartData: ChartDataPoint[];
  insights: string[];
  uploadedAt: Date;
}

export interface ParsedRow {
  [key: string]: string | number;
}
