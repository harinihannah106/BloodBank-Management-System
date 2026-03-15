import { useState, useEffect } from 'react';
import { donorAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function DonorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donorAPI.getNotifications().then(({ data }) => setNotifications(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const respond = async (id, accept) => {
    try {
      await donorAPI.respondNotification(id, accept);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: accept ? 'ACCEPTED' : 'DECLINED', read: true } : n));
      toast.success(accept ? '✓ Request accepted!' : 'Request declined');
    } catch (e) {
      toast.error('Failed to respond');
    }
  };

  const urgencyBadge = (u) => u === 'EMERGENCY' ? 'badge-emergency' : u === 'HIGH' ? 'badge-high' : 'badge-normal';

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{notifications.filter(n => !n.read).length} unread notifications</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <h3>No notifications</h3>
            <p>Blood donation requests will appear here when recipients near you need blood.</p>
          </div>
        </div>
      ) : (
        <div>
          {notifications.map(n => (
            <div key={n.id} className={`notification-card ${n.urgency === 'EMERGENCY' ? 'critical' : ''}`}
              style={{ background: n.read ? '#FAFAFA' : 'white', opacity: n.status === 'DECLINED' ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div style={{
                  width: 48, height: 48,
                  background: n.urgency === 'EMERGENCY' ? '#FEE2E2' : '#FFF0F2',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0
                }}>
                  🏥
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 15 }}>{n.hospitalName}</strong>
                    <span className={`badge ${urgencyBadge(n.urgency)}`}>{n.urgency}</span>
                    {!n.read && <span className="badge" style={{ background: '#DBEAFE', color: '#1E40AF' }}>NEW</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>
                    Blood Group: <strong>{n.bloodGroup}</strong> · {n.distance?.toFixed(1)} km away
                  </div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div>
                {n.status === 'PENDING' ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-success btn-sm" onClick={() => respond(n.id, true)}>✓ Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => respond(n.id, false)}>✗ Decline</button>
                  </div>
                ) : (
                  <span className={`badge ${n.status === 'ACCEPTED' ? 'badge-completed' : 'badge-rejected'}`}>
                    {n.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
