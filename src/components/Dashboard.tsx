import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, CreditCard,
  Landmark, Scale, PieChart as PieIcon, Upload,
  Lightbulb, Calendar, Building2, RefreshCw
} from 'lucide-react';
import type { FinancialReport } from '../types';
import { formatCurrency, formatPercent } from '../utils';

interface DashboardProps {
  report: FinancialReport;
  onReset: () => void;
}

const COLORS = {
  revenue: '#2563eb',
  expenses: '#ef4444',
  netIncome: '#16a34a',
  assets: '#0284c7',
  liabilities: '#f97316',
  equity: '#7c3aed',
};

const PIE_COLORS = ['#f97316', '#7c3aed'];

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      fontSize: '0.825rem',
    }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: '#111827' }}>{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color, margin: '2px 0' }}>
          {entry.name}: <strong>{formatCurrency(entry.value)}</strong>
        </p>
      ))}
    </div>
  );
}

function MetricCard({
  label, value, sub, colorClass, icon, valueClass,
}: {
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="metric-card">
      <div className="metric-icon-row">
        <div className={`metric-icon ${colorClass}`}>{icon}</div>
        <span className="metric-label">{label}</span>
      </div>
      <div className={`metric-value ${valueClass || ''}`}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export function Dashboard({ report, onReset }: DashboardProps) {
  const { companyName, reportingPeriod, metrics, chartData, insights, uploadedAt } = report;
  const { revenue, expenses, netIncome, profitMargin, assets, liabilities, equity } = metrics;

  const balancePieData = [
    { name: 'Liabilities', value: liabilities },
    { name: 'Equity', value: equity },
  ].filter(d => d.value > 0);

  const formattedDate = uploadedAt.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-block">
          <div className="dashboard-eyebrow">Financial Analysis Report</div>
          <div className="dashboard-company">{companyName}</div>
          <div className="dashboard-meta">
            <Calendar size={13} />
            {reportingPeriod}
            <span className="dashboard-meta-dot" />
            <Building2 size={13} />
            Analyzed on {formattedDate}
          </div>
        </div>
        <div className="dashboard-actions">
          <button className="btn-outline" onClick={onReset}>
            <Upload size={15} />
            New Report
          </button>
          <button className="btn-outline" onClick={() => window.print()}>
            Export PDF
          </button>
          <button className="btn-primary" onClick={onReset}>
            <RefreshCw size={15} />
            Analyze Another
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(revenue)}
          sub="Cumulative period revenue"
          colorClass="blue"
          icon={<DollarSign size={18} />}
          valueClass="accent"
        />
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(expenses)}
          sub="Cumulative period expenses"
          colorClass="red"
          icon={<CreditCard size={18} />}
          valueClass={expenses > revenue ? 'negative' : ''}
        />
        <MetricCard
          label="Net Income"
          value={formatCurrency(netIncome)}
          sub={netIncome >= 0 ? 'Profitable period' : 'Operating at a loss'}
          colorClass="green"
          icon={<TrendingUp size={18} />}
          valueClass={netIncome >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Profit Margin"
          value={formatPercent(profitMargin)}
          sub="Net income as % of revenue"
          colorClass="purple"
          icon={profitMargin >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          valueClass={profitMargin >= 15 ? 'positive' : profitMargin < 0 ? 'negative' : 'accent'}
        />
      </div>

      {/* Balance Sheet Row */}
      {(assets > 0 || liabilities > 0 || equity > 0) && (
        <div className="balance-grid">
          <MetricCard
            label="Total Assets"
            value={formatCurrency(assets)}
            sub="Resources owned by company"
            colorClass="sky"
            icon={<Landmark size={18} />}
            valueClass="accent"
          />
          <MetricCard
            label="Total Liabilities"
            value={formatCurrency(liabilities)}
            sub="Obligations owed to creditors"
            colorClass="amber"
            icon={<Scale size={18} />}
            valueClass={liabilities > assets ? 'negative' : ''}
          />
          <MetricCard
            label="Shareholders' Equity"
            value={formatCurrency(equity)}
            sub="Net worth / book value"
            colorClass="teal"
            icon={<PieIcon size={18} />}
            valueClass={equity > 0 ? 'positive' : 'negative'}
          />
        </div>
      )}

      {/* Charts */}
      <div className="charts-grid">
        {/* Revenue vs Expenses Area Chart */}
        <div className="chart-card">
          <div className="chart-title">Revenue vs. Expenses</div>
          <div className="chart-subtitle">Period-by-period financial performance</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.expenses} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={COLORS.expenses} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => formatCurrency(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={COLORS.revenue}
                strokeWidth={2.5}
                fill="url(#revGrad)"
                dot={{ r: 3, fill: COLORS.revenue }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke={COLORS.expenses}
                strokeWidth={2.5}
                fill="url(#expGrad)"
                dot={{ r: 3, fill: COLORS.expenses }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Balance Sheet Funding Structure Pie */}
        <div className="chart-card">
          <div className="chart-title">Balance Sheet Structure</div>
          <div className="chart-subtitle">
            Funding composition (Total Assets: {formatCurrency(assets)})
          </div>
          {balancePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={balancePieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {balancePieData.map((_entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: 10, fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No balance sheet data available
            </div>
          )}
        </div>
      </div>

      {/* Net Income Bar Chart */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title">Net Income by Period</div>
        <div className="chart-subtitle">Profitability trend over time</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => formatCurrency(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="netIncome"
              name="Net Income"
              fill={COLORS.netIncome}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.netIncome >= 0 ? COLORS.netIncome : COLORS.expenses}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="insights-card">
        <div className="section-title">
          <Lightbulb size={18} color="var(--warning)" />
          Financial Insights & Analysis
        </div>
        <div className="section-subtitle">
          Automated analysis based on your financial data
        </div>
        <ul className="insights-list">
          {insights.map((insight, i) => (
            <li key={i} className="insight-item">
              <span className="insight-bullet" />
              <span className="insight-text">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
