import { useState } from 'react';
import './index.css';
import type { AppState, FinancialReport } from './types';
import { Navbar } from './components/Navbar';
import { UploadScreen } from './components/UploadScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './components/Dashboard';
import { ErrorScreen } from './components/ErrorScreen';

export default function App() {
  const [state, setState] = useState<AppState>('upload');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  function handleAnalyze(r: FinancialReport) {
    setReport(r);
    setState('results');
  }

  function handleError(msg: string) {
    setErrorMsg(msg);
    setState('error');
  }

  function handleLoading() {
    setState('loading');
  }

  function handleReset() {
    setReport(null);
    setErrorMsg('');
    setState('upload');
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        {state === 'upload' && (
          <UploadScreen
            onAnalyze={handleAnalyze}
            onError={handleError}
            onLoading={handleLoading}
          />
        )}
        {state === 'loading' && <LoadingScreen />}
        {state === 'results' && report && (
          <Dashboard report={report} onReset={handleReset} />
        )}
        {state === 'error' && (
          <ErrorScreen message={errorMsg} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
