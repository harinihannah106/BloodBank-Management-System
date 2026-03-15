import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipientAPI } from '../../services/api';
import { PlusCircle } from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipientAPI.getMyRequests().then(({ data }) => setRequests(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    const map = { PENDING: 'badge-pending', APPROVED: 'badge-approved', DONOR_ASSIGNED: 'badge-assigned', COMPLETED: 'badge-completed', REJECTED: 'badge-rejected' };
    return map[s] || 'badge-pending';
  };

  const statusIcon = (s) => ({ PENDING: '⏳', APPROVED: '✅', DONOR_ASSIGNED: '👤', COMPLETED: '✔', REJECTED: '❌' }[s] || '');

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Requests</h1>
          <p className="page-subtitle">{requests.length} total requests</p>
        </div>
        <Link to="/recipient/create-request" className="btn btn-primary">
          <PlusCircle size={16} /> New Request
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['ALL', 'PENDING', 'APPROVED', 'DONOR_ASSIGNED', 'COMPLETED', 'REJECTED'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No requests found</h3>
            <p>{filter === 'ALL' ? 'Create your first blood request to get started.' : `No ${filter.toLowerCase()} requests.`}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map(r => (
            <div key={r.id} className="card" style={{ borderLeft: `4px solid ${r.urgency === 'EMERGENCY' ? 'var(--red)' : r.urgency === 'HIGH' ? '#F59E0B' : '#10B981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 44, height: 44,
                      background: 'var(--red-pale)',
                      color: 'var(--red)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800, fontSize: 16
                    }}>{r.bloodGroup}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{r.hospitalName}</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>{r.units} unit{r.units > 1 ? 's' : ''} needed</div>
                    </div>
                  </div>
                </div>
                <span className={`badge ${statusBadge(r.status)}`}>{statusIcon(r.status)} {r.status?.replace('_', ' ')}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  ['Urgency', <span className={`badge badge-${r.urgency?.toLowerCase()}`}>{r.urgency}</span>],
                  ['Required By', r.requiredDate ? new Date(r.requiredDate).toLocaleDateString('en-IN') : 'ASAP'],
                  ['Request ID', `#${r.id}`],
                  ['Submitted', new Date(r.createdAt).toLocaleDateString('en-IN')],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: '#F7F8FC', borderRadius: 6, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>

              {r.assignedDonorName && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#D1FAE5', borderRadius: 8, fontSize: 13 }}>
                  <strong>Donor Assigned:</strong> {r.assignedDonorName}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
