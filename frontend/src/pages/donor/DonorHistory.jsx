import { useState, useEffect } from 'react';
import { donorAPI } from '../../services/api';

export default function DonorHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donorAPI.getHistory().then(({ data }) => setHistory(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  const totalUnits = history.reduce((sum, h) => sum + h.units, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Donation History</h1>
          <p className="page-subtitle">Your complete donation record</p>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          ['🩸', 'Total Donations', history.length, '#E8192C', '#FFF0F2'],
          ['💧', 'Total Units', totalUnits, '#3B82F6', '#DBEAFE'],
          ['✅', 'Completed', history.filter(h => h.status === 'COMPLETED').length, '#10B981', '#D1FAE5'],
        ].map(([icon, label, val, color, bg]) => (
          <div key={label} className="metric-card" style={{ '--accent': color }}>
            <div className="metric-icon" style={{ background: bg, color, fontSize: 20 }}>{icon}</div>
            <div className="metric-value">{val}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h2 className="card-title">All Donations</h2></div>
        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🩸</div>
            <h3>No donations yet</h3>
            <p>Your donation history will appear here after your first donation.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Hospital</th><th>Units</th><th>Status</th></tr></thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td>{new Date(h.donationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{h.hospitalName}</td>
                    <td><strong>{h.units}</strong> unit{h.units > 1 ? 's' : ''}</td>
                    <td><span className={`badge badge-${h.status?.toLowerCase()}`}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
