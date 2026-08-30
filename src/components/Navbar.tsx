import { BarChart2 } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-icon">
          <BarChart2 size={18} />
        </div>
        <span>FinAnalyzer</span>
      </div>
      <span className="navbar-badge">Financial Intelligence Platform</span>
    </nav>
  );
}
