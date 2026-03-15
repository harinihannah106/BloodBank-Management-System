import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getRequests().then(({ data }) => setRequests(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    try {
      const { data } = await adminAPI.approveRequest(id);
      setRequests(prev => prev.map(r => r.id === id ? data : r));
      toast.success('Request approved');
    } catch (e) { toast.error('Failed to approve'); }
  };

  const reject = async (id) => {
    try {
      const { data } = await adminAPI.rejectRequest(id);
      setRequests(prev => prev.map(r => r.id === id ? data : r));
      toast.success('Request rejected');
    } catch (e) { toast.error('Failed to reject'); }
  };

  const statusBadge = (s) => {
    const map = { PENDING: 'badge-pending', APPROVED: 'badge-approved', DONOR_ASSIGNED: 'badge-assigned', COMPLETED: 'badge-completed', REJECTED: 'badge-rejected' };
    return map[s] || 'badge-pending';
  };

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blood Requests</h1>
          <p className="page-subtitle">Review and manage all blood requests</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '8px 16px', background: '#FEE2E2', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#991B1B' }}>
            🚨 {requests.filter(r => r.urgency === 'EMERGENCY' && r.status === 'PENDING').length} Emergency Pending
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
            {s} {filter !== s && <span style={{ fontSize: 11, opacity: 0.6 }}>({s === 'ALL' ? requests.length : requests.filter(r => r.status === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Recipient</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Hospital</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>No requests found</td></tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} style={{ background: r.urgency === 'EMERGENCY' && r.status === 'PENDING' ? '#FFF5F5' : '' }}>
                    <td><span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--red)' }}>#{r.id}</span></td>
                    <td>{r.recipientName || 'Unknown'}</td>
                    <td>
                      <span style={{ background: 'var(--red-pale)', color: 'var(--red)', padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontSize: 13 }}>
                        {r.bloodGroup}
                      </span>
                    </td>
                    <td><strong>{r.units}</strong></td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.hospitalName}</td>
                    <td><span className={`badge badge-${r.urgency?.toLowerCase()}`}>{r.urgency}</span></td>
                    <td><span className={`badge ${statusBadge(r.status)}`}>{r.status?.replace('_', ' ')}</span></td>
                    <td style={{ color: '#6B7280', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      {r.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-success btn-sm" onClick={() => approve(r.id)}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => reject(r.id)}>Reject</button>
                        </div>
                      )}
                      {r.status !== 'PENDING' && <span style={{ fontSize: 13, color: '#9CA3AF' }}>—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
