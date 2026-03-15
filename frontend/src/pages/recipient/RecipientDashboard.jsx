import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recipientAPI } from '../../services/api';
import { PlusCircle, ClipboardList, Heart } from 'lucide-react';

export default function RecipientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipientAPI.getMyRequests().then(({ data }) => setRequests(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    const map = { PENDING: 'badge-pending', APPROVED: 'badge-approved', DONOR_ASSIGNED: 'badge-assigned', COMPLETED: 'badge-completed', REJECTED: 'badge-rejected' };
    return map[s] || 'badge-pending';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recipient Dashboard</h1>
          <p className="page-subtitle">Welcome, {user?.name}</p>
        </div>
        <Link to="/recipient/create-request" className="btn btn-primary">
          <PlusCircle size={16} /> New Request
        </Link>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 28 }}>
        {[
          ['📋', 'Total Requests', requests.length, '#E8192C', '#FFF0F2'],
          ['⏳', 'Pending', requests.filter(r => r.status === 'PENDING').length, '#F59E0B', '#FEF3C7'],
          ['✅', 'Approved', requests.filter(r => r.status === 'APPROVED' || r.status === 'DONOR_ASSIGNED').length, '#10B981', '#D1FAE5'],
          ['✔', 'Completed', requests.filter(r => r.status === 'COMPLETED').length, '#3B82F6', '#DBEAFE'],
        ].map(([icon, label, val, color, bg]) => (
          <div key={label} className="metric-card" style={{ '--accent': color }}>
            <div className="metric-icon" style={{ background: bg, color, fontSize: 20 }}>{icon}</div>
            <div className="metric-value">{val}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
        {[
          { to: '/recipient/create-request', icon: '🩸', title: 'Create Blood Request', desc: 'Request blood for emergency or planned procedure', color: 'var(--red)' },
          { to: '/recipient/my-requests', icon: '📋', title: 'Track Requests', desc: 'Monitor status of your blood requests', color: '#3B82F6' },
          { to: '/recipient/donors', icon: '👥', title: 'Find Donors', desc: 'Browse compatible donors near your location', color: '#10B981' },
        ].map(({ to, icon, title, desc, color }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Requests</h2>
          <Link to="/recipient/my-requests" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No requests yet</h3>
            <p>Create your first blood request to get started.</p>
            <Link to="/recipient/create-request" className="btn btn-primary" style={{ marginTop: 16 }}>Create Request</Link>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Blood Group</th><th>Units</th><th>Hospital</th><th>Urgency</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map(r => (
                  <tr key={r.id}>
                    <td><strong style={{ color: 'var(--red)' }}>{r.bloodGroup}</strong></td>
                    <td>{r.units}</td>
                    <td>{r.hospitalName}</td>
                    <td><span className={`badge badge-${r.urgency?.toLowerCase()}`}>{r.urgency}</span></td>
                    <td><span className={`badge ${statusBadge(r.status)}`}>{r.status?.replace('_', ' ')}</span></td>
                    <td style={{ color: '#6B7280', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
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
