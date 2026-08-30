export function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <div className="loading-text">
        <h2>Analyzing your financial data…</h2>
        <p>Processing metrics, computing ratios, and generating insights.</p>
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
