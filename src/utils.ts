import type { FinancialMetrics, ChartDataPoint, FinancialReport, ParsedRow } from './types';

export const DEMO_REPORT: FinancialReport = {
  companyName: 'Acme Corporation',
  reportingPeriod: 'FY 2024',
  uploadedAt: new Date(),
  metrics: {
    revenue: 12_450_000,
    expenses: 9_180_000,
    netIncome: 3_270_000,
    profitMargin: 26.27,
    assets: 28_600_000,
    liabilities: 11_200_000,
    equity: 17_400_000,
  },
  chartData: [
    { period: 'Q1 2023', revenue: 2_800_000, expenses: 2_200_000, netIncome: 600_000 },
    { period: 'Q2 2023', revenue: 3_100_000, expenses: 2_350_000, netIncome: 750_000 },
    { period: 'Q3 2023', revenue: 2_950_000, expenses: 2_180_000, netIncome: 770_000 },
    { period: 'Q4 2023', revenue: 3_400_000, expenses: 2_470_000, netIncome: 930_000 },
    { period: 'Q1 2024', revenue: 2_950_000, expenses: 2_100_000, netIncome: 850_000 },
    { period: 'Q2 2024', revenue: 3_200_000, expenses: 2_280_000, netIncome: 920_000 },
    { period: 'Q3 2024', revenue: 3_050_000, expenses: 2_310_000, netIncome: 740_000 },
    { period: 'Q4 2024', revenue: 3_250_000, expenses: 2_490_000, netIncome: 760_000 },
  ],
  insights: [
    'Revenue grew 8.7% year-over-year, outpacing industry average of 4.2%.',
    'Profit margin of 26.3% is above the sector median of 19.8%, indicating strong cost discipline.',
    'Debt-to-equity ratio stands at 0.64, reflecting a conservative and healthy capital structure.',
    'Q4 2024 expenses increased 7.3% QoQ — monitor for cost creep entering FY 2025.',
    'Equity grew 12.1% YoY, signaling strong retained earnings and investor confidence.',
    'Operating cash flow coverage is robust, with liabilities representing only 39.2% of total assets.',
  ],
};

export const DEMO_CSV = `Period,Revenue,Expenses,Net Income,Assets,Liabilities,Equity
Q1 2024,2950000,2100000,850000,26000000,10500000,15500000
Q2 2024,3200000,2280000,920000,27000000,10800000,16200000
Q3 2024,3050000,2310000,740000,27800000,11000000,16800000
Q4 2024,3250000,2490000,760000,28600000,11200000,17400000
`;

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseNumericValue(val: unknown): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : val;
  }
  if (val === null || val === undefined) {
    return 0;
  }
  const str = String(val).trim();
  if (!str) return 0;

  // Detect accounting parenthesis format: ($50,000) or (50000)
  const isParenthesesNegative = /^\s*\((.+)\)\s*$/.test(str);
  // Detect leading minus: -$50,000 or -50000
  const isMinusNegative = /^\s*-\s*/.test(str);
  const isNegative = isParenthesesNegative || isMinusNegative;

  // Strip currency symbols, commas, parentheses, plus/minus, whitespace
  const cleaned = str.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;

  return isNegative ? -parsed : parsed;
}

function findValue(row: ParsedRow, ...candidates: string[]): number {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [normalizeKey(k), v])
  );
  for (const c of candidates) {
    const val = normalized[normalizeKey(c)];
    if (val !== undefined && val !== null && val !== '') {
      const num = parseNumericValue(val);
      if (!isNaN(num)) return num;
    }
  }
  return 0;
}

function findPeriod(row: ParsedRow): string {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [normalizeKey(k), v])
  );
  for (const key of ['period', 'quarter', 'date', 'year', 'fiscal', 'month']) {
    if (normalized[key]) return String(normalized[key]);
  }
  return '';
}

export function parseRows(rows: ParsedRow[], companyName: string, reportingPeriod: string): FinancialReport {
  if (rows.length === 0) throw new Error('No data rows found in the uploaded file.');

  const chartData: ChartDataPoint[] = rows.map((row, i) => ({
    period: findPeriod(row) || `Period ${i + 1}`,
    revenue: findValue(row, 'revenue', 'total revenue', 'sales', 'total sales', 'income'),
    expenses: findValue(row, 'expenses', 'total expenses', 'costs', 'total costs', 'operating expenses', 'opex'),
    netIncome: findValue(row, 'net income', 'netincome', 'profit', 'net profit', 'earnings'),
  }));

  const lastRow = rows[rows.length - 1];

  let totalRevenue = chartData.reduce((s, r) => s + r.revenue, 0);
  let totalExpenses = chartData.reduce((s, r) => s + r.expenses, 0);
  let totalNetIncome = chartData.reduce((s, r) => s + r.netIncome, 0);

  // If net income isn't explicitly in the data, compute it
  if (totalNetIncome === 0 && totalRevenue > 0) {
    totalNetIncome = totalRevenue - totalExpenses;
    chartData.forEach(d => { d.netIncome = d.revenue - d.expenses; });
  }

  const assets = findValue(lastRow, 'assets', 'total assets');
  const liabilities = findValue(lastRow, 'liabilities', 'total liabilities');
  const equity = findValue(lastRow, 'equity', "shareholders equity", "stockholders equity", "total equity")
    || (assets > 0 && liabilities > 0 ? assets - liabilities : 0);

  const profitMargin = totalRevenue > 0 ? (totalNetIncome / totalRevenue) * 100 : 0;

  const insights = generateInsights({
    revenue: totalRevenue,
    expenses: totalExpenses,
    netIncome: totalNetIncome,
    profitMargin,
    assets,
    liabilities,
    equity,
  });

  return {
    companyName,
    reportingPeriod,
    uploadedAt: new Date(),
    metrics: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome: totalNetIncome,
      profitMargin,
      assets,
      liabilities,
      equity,
    },
    chartData,
    insights,
  };
}

function generateInsights(m: FinancialMetrics): string[] {
  const insights: string[] = [];

  if (m.profitMargin > 20) {
    insights.push(`Strong profit margin of ${m.profitMargin.toFixed(1)}% — well above typical industry benchmarks.`);
  } else if (m.profitMargin > 10) {
    insights.push(`Healthy profit margin of ${m.profitMargin.toFixed(1)}%, indicating solid operational efficiency.`);
  } else if (m.profitMargin > 0) {
    insights.push(`Profit margin of ${m.profitMargin.toFixed(1)}% is positive but has room for improvement through cost optimization.`);
  } else {
    insights.push(`Negative profit margin detected — expenses exceed revenue. Immediate cost review recommended.`);
  }

  if (m.assets > 0 && m.liabilities > 0) {
    const debtRatio = m.liabilities / m.assets;
    if (debtRatio < 0.4) {
      insights.push(`Debt-to-asset ratio of ${(debtRatio * 100).toFixed(1)}% is low, indicating a financially stable balance sheet.`);
    } else if (debtRatio < 0.6) {
      insights.push(`Debt-to-asset ratio of ${(debtRatio * 100).toFixed(1)}% is moderate — monitor liability growth closely.`);
    } else {
      insights.push(`Debt-to-asset ratio of ${(debtRatio * 100).toFixed(1)}% is elevated — consider debt reduction strategies.`);
    }
  }

  if (m.equity > 0 && m.netIncome > 0) {
    const roe = (m.netIncome / m.equity) * 100;
    insights.push(`Return on Equity (ROE) is ${roe.toFixed(1)}% — ${roe > 15 ? 'an excellent return for shareholders.' : 'shareholders may expect improved returns over time.'}`);
  }

  if (m.revenue > m.expenses) {
    insights.push(`Revenue exceeds expenses by ${formatCurrencyRaw(m.revenue - m.expenses)}, confirming operational profitability.`);
  }

  if (m.assets > 0 && m.liabilities > 0) {
    const currentRatio = m.assets / m.liabilities;
    insights.push(`Asset coverage ratio of ${currentRatio.toFixed(2)}x suggests ${currentRatio > 2 ? 'strong' : 'adequate'} ability to cover liabilities.`);
  }

  return insights;
}

function formatCurrencyRaw(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
