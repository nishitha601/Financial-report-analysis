# Financial Report Analyzer

A modern, client-side financial report analysis web application built with React, TypeScript, and Vite. Upload CSV or XLSX financial statements or use built-in demo data to instantly generate executive financial summaries, key performance metrics, interactive visual charts, and automated insights — 100% in the browser with no backend, no database, and no API keys required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://financial-report-analyzer-6ybb.onrender.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/nishitha601/Financial-report-analysis)

---

## 🌐 Live Demo

The application is deployed and publicly accessible on Render:

🔗 **[https://financial-report-analyzer-6ybb.onrender.com/](https://financial-report-analyzer-6ybb.onrender.com/)**

---

## 🚀 Key Features

- **File Upload Support (CSV & XLSX)**: Seamless drag-and-drop or file picker for standard financial reports with client-side parsing.
- **Instant Demo Data**: Test all features immediately without preparing or uploading files with the "Use Demo Data" button.
- **Executive Financial Dashboard**:
  - **Core Metrics**: Total Revenue, Total Expenses, Net Income, and Profit Margin.
  - **Balance Sheet Indicators**: Total Assets, Total Liabilities, and Shareholders' Equity.
- **Interactive Visualizations**:
  - **Revenue vs. Expenses**: Area trend line chart over reporting periods.
  - **Net Income by Period**: Bar chart highlighting profitable periods and losses.
  - **Balance Sheet Breakdown**: Donut chart displaying asset, liability, and equity distributions.
- **Automated Financial Insights**: Rule-based analysis evaluating profitability margins, debt-to-asset safety ratios, and return on equity (ROE).
- **Client-Side Privacy & Security**: All processing and calculations run locally in the browser; no data leaves your machine.
- **Responsive & Clean Financial SaaS UI**: Polished interface optimized for desktop and mobile viewports with print/PDF export support.

---

## 📊 Expected Data Format

Your CSV or Excel file should have a header row. The analyzer automatically normalizes and detects common column naming conventions:

| Metric | Supported Header Names (Case-Insensitive) |
|--------|------------------------------------------|
| **Period** | `Period`, `Quarter`, `Date`, `Month`, `Year`, `Fiscal` |
| **Revenue** | `Revenue`, `Total Revenue`, `Sales`, `Total Sales`, `Income` |
| **Expenses** | `Expenses`, `Total Expenses`, `Costs`, `Total Costs`, `Operating Expenses`, `Opex` |
| **Net Income** | `Net Income`, `Net Profit`, `Profit`, `Earnings` |
| **Assets** | `Assets`, `Total Assets` |
| **Liabilities** | `Liabilities`, `Total Liabilities` |
| **Equity** | `Equity`, `Total Equity`, `Shareholders Equity`, `Stockholders Equity` |

### Sample CSV Structure

```csv
Period,Revenue,Expenses,Net Income,Assets,Liabilities,Equity
Q1 2024,2950000,2100000,850000,26000000,10500000,15500000
Q2 2024,3200000,2280000,920000,27000000,10800000,16200000
Q3 2024,3050000,2310000,740000,27800000,11000000,16800000
Q4 2024,3250000,2490000,760000,28600000,11200000,17400000
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Charts & Visualizations**: Recharts
- **Parsers**:
  - Papa Parse (CSV)
  - SheetJS / xlsx (Excel spreadsheets)
- **Icons**: Lucide React
- **Styling**: Modern CSS with CSS Custom Properties and responsive design

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/nishitha601/Financial-report-analysis.git

# Navigate to the project directory
cd Financial-report-analysis

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Preview Locally

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Production Deployment

The project is deployed on **Render** as a Static Site.

### Render Configuration
- **Platform**: Render
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Setting Up on Render:
1. Connect the GitHub repository: [`https://github.com/nishitha601/Financial-report-analysis`](https://github.com/nishitha601/Financial-report-analysis)
2. Select **Static Site**.
3. Set the **Build Command** to `npm install && npm run build`.
4. Set the **Publish Directory** to `dist`.
5. Deploy. Auto-deploy triggers on every push to the `main` branch.

---

## 📁 Project Structure

```
Financial-report-analysis/
├── public/
│   ├── favicon.svg          # Custom favicon
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx    # Comprehensive financial dashboard & charts
│   │   ├── ErrorScreen.tsx  # Error state view with retry action
│   │   ├── LoadingScreen.tsx# Animated analysis loading view
│   │   ├── Navbar.tsx       # Brand navigation header
│   │   └── UploadScreen.tsx # File drag-and-drop & configuration form
│   ├── App.tsx              # Root component & state workflow
│   ├── index.css            # Professional SaaS design styling
│   ├── main.tsx             # Application bootstrap
│   ├── types.ts             # TypeScript definitions
│   └── utils.ts             # Data parser, demo datasets & ratio calculators
├── index.html               # Main HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## 📄 License

MIT License © 2024 [Financial Report Analyzer](https://github.com/nishitha601/Financial-report-analysis)
