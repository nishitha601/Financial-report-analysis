import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, Sparkles, BarChart2, X, AlertCircle } from 'lucide-react';
import { DEMO_REPORT, parseRows } from '../utils';
import type { FinancialReport } from '../types';

const REPORTING_PERIODS = [
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024',
  'FY 2024', 'H1 2024', 'H2 2024',
  'Q1 2025', 'Q2 2025', 'FY 2025',
];

interface UploadScreenProps {
  onAnalyze: (report: FinancialReport) => void;
  onError: (msg: string) => void;
  onLoading: () => void;
}

export function UploadScreen({ onAnalyze, onError, onLoading }: UploadScreenProps) {
  const [companyName, setCompanyName] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [customPeriod, setCustomPeriod] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  function validateFile(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      setFileError('Only CSV and XLSX files are supported.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be under 10MB.');
      return false;
    }
    setFileError('');
    return true;
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function removeFile() {
    setSelectedFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleAnalyze() {
    const company = companyName.trim() || 'My Company';
    const period = reportingPeriod === '__custom__'
      ? customPeriod.trim() || 'Custom Period'
      : reportingPeriod || 'FY 2024';

    onLoading();

    if (!selectedFile) {
      // Should not reach here — button disabled
      return;
    }

    try {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      let rows: Record<string, string | number>[] = [];

      if (ext === 'csv') {
        const { default: Papa } = await import('papaparse');
        const text = await selectedFile.text();
        const result = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        rows = result.data as Record<string, string | number>[];
      } else {
        const { read, utils } = await import('xlsx');
        const buffer = await selectedFile.arrayBuffer();
        const wb = read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = utils.sheet_to_json<Record<string, string | number>>(ws, { defval: 0 });
      }

      const report = parseRows(rows, company, period);
      onAnalyze(report);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file.';
      onError(msg);
    }
  }

  function handleDemoData() {
    const company = companyName.trim() || 'Acme Corporation';
    const period = reportingPeriod === '__custom__'
      ? customPeriod.trim() || 'FY 2024'
      : reportingPeriod || 'FY 2024';

    onLoading();
    // Small delay for realistic UX
    setTimeout(() => {
      onAnalyze({ ...DEMO_REPORT, companyName: company, reportingPeriod: period });
    }, 1400);
  }

  const canAnalyze = selectedFile !== null;
  const showCustomPeriod = reportingPeriod === '__custom__';

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1>Financial Report Analyzer</h1>
        <p>Upload your financial data and get instant financial analysis, metrics, and actionable insights.</p>
      </div>

      <div className="upload-card">
        {/* Company & Period */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company-name">Company Name</label>
            <input
              id="company-name"
              type="text"
              placeholder="e.g. Acme Corporation"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reporting-period">Reporting Period</label>
            <select
              id="reporting-period"
              value={reportingPeriod}
              onChange={e => setReportingPeriod(e.target.value)}
            >
              <option value="">Select period…</option>
              {REPORTING_PERIODS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="__custom__">Custom…</option>
            </select>
          </div>
        </div>

        {showCustomPeriod && (
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label htmlFor="custom-period">Custom Period</label>
            <input
              id="custom-period"
              type="text"
              placeholder="e.g. Q3 FY2024–25"
              value={customPeriod}
              onChange={e => setCustomPeriod(e.target.value)}
            />
          </div>
        )}

        <div className="divider">
          <span>Upload your financial report</span>
        </div>

        {/* Drop Zone */}
        {!selectedFile && (
          <div
            className={`drop-zone${dragOver ? ' drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(false)}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              aria-label="Upload financial report"
            />
            <div className="drop-zone-icon">
              <Upload size={26} />
            </div>
            <h3>Drop your file here, or click to browse</h3>
            <p>Drag and drop your financial report to get started</p>
            <div className="supported-formats">
              <span className="format-badge"><FileSpreadsheet size={12} /> CSV</span>
              <span className="format-badge"><FileSpreadsheet size={12} /> XLSX</span>
              <span className="format-badge"><FileSpreadsheet size={12} /> XLS</span>
            </div>
          </div>
        )}

        {/* File Selected */}
        {selectedFile && (
          <div className="file-selected">
            <div className="file-selected-icon">
              <FileSpreadsheet size={22} />
            </div>
            <div className="file-selected-info">
              <div className="file-selected-name">{selectedFile.name}</div>
              <div className="file-selected-size">
                {(selectedFile.size / 1024).toFixed(1)} KB · Ready to analyze
              </div>
            </div>
            <button className="file-remove-btn" onClick={removeFile} aria-label="Remove file">
              <X size={18} />
            </button>
          </div>
        )}

        {/* File Error */}
        {fileError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 16 }}>
            <AlertCircle size={16} />
            {fileError}
          </div>
        )}

        {/* Demo Data Button */}
        <button className="demo-btn" onClick={handleDemoData}>
          <Sparkles size={16} />
          Use Demo Data — see a sample dashboard instantly
        </button>

        {/* Analyze Button */}
        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          title={!canAnalyze ? 'Upload a file or use Demo Data' : 'Analyze report'}
        >
          <BarChart2 size={18} />
          Analyze Report
        </button>
      </div>
    </div>
  );
}
