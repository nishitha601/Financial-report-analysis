import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  message: string;
  onReset: () => void;
}

export function ErrorScreen({ message, onReset }: ErrorScreenProps) {
  return (
    <div className="error-container">
      <div className="error-icon">
        <AlertTriangle size={32} />
      </div>
      <h2>Analysis Failed</h2>
      <p>
        {message || 'Something went wrong while processing your file. Please check the format and try again.'}
      </p>
      <button className="analyze-btn" onClick={onReset} style={{ maxWidth: 280, margin: '0 auto' }}>
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
