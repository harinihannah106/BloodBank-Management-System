import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donorAPI } from '../../services/api';
import { Droplets, CheckCircle, Clock, Calendar, ArrowRight, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profRes, notifRes, histRes] = await Promise.all([
          donorAPI.getProfile().catch(() => null),
          donorAPI.getNotifications().catch(() => ({ data: [] })),
          donorAPI.getHistory().catch(() => ({ data: [] }))
        ]);
        if (profRes) setProfile(profRes.data);
        setNotifications(notifRes.data || []);
        setHistory(histRes.data || []);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const handleRespond = async (id, accept) => {
    try {
      await donorAPI.respondNotification(id, accept);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: accept ? 'ACCEPTED' : 'DECLINED', read: true } : n));
      toast.success(accept ? 'Request accepted!' : 'Request declined');
    } catch (e) {
      toast.error('Failed to respond');
    }
  };

  const urgencyColor = (u) => u === 'EMERGENCY' ? 'badge-emergency' : u === 'HIGH' ? 'badge-high' : 'badge-normal';

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}</p>
        </div>
        {!profile && (
          <Link to="/donor/profile" className="btn btn-primary">
            Complete Profile <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {!profile && (
        <div className="alert alert-warning">
          ⚠️ Please complete your donor profile to start receiving donation requests.
          <Link to="/donor/profile" style={{ marginLeft: 8, fontWeight: 700, color: '#92400E' }}>Complete now →</Link>
        </div>
      )}

      {profile && (
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-large">{user?.name?.[0]}</div>
            <div>
              <div className="profile-name">{user?.name}</div>
              <div className="profile-blood">Blood Group: <strong>{profile.bloodGroup}</strong> · {profile.city}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <span className={`badge ${profile.eligible ? 'badge-available' : 'badge-ineligible'}`} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {profile.eligible ? '✓ Eligible' : '✗ Not Eligible'}
              </span>
              <span className={`badge ${profile.available ? 'badge-available' : 'badge-unavailable'}`} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {profile.available ? '🟢 Available' : '🔴 Unavailable'}
              </span>
            </div>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{profile.totalDonations}</div>
              <div className="profile-stat-label">Total Donations</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{profile.bloodGroup}</div>
              <div className="profile-stat-label">Blood Group</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{profile.nextEligibleDate ? new Date(profile.nextEligibleDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Now'}</div>
              <div className="profile-stat-label">Next Eligible</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
        {[
          { icon: Droplets, label: 'Total Donations', value: profile?.totalDonations ?? 0, color: '#E8192C', bg: '#FFF0F2' },
          { icon: CheckCircle, label: 'Status', value: profile?.eligible ? 'Eligible' : 'Ineligible', color: '#10B981', bg: '#D1FAE5' },
          { icon: Bell, label: 'Notifications', value: notifications.filter(n => !n.read).length, color: '#F59E0B', bg: '#FEF3C7' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="metric-card" style={{ '--accent': color }}>
            <div className="metric-icon" style={{ background: bg, color }}><Icon size={20} /></div>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2 className="card-title">🔔 Donation Requests</h2>
          <Link to="/donor/notifications" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {notifications.filter(n => n.status === 'PENDING').slice(0, 3).length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p>No pending requests right now.</p>
          </div>
        ) : (
          notifications.filter(n => n.status === 'PENDING').slice(0, 3).map(n => (
            <div key={n.id} className={`notification-card ${n.urgency === 'EMERGENCY' ? 'critical' : ''}`}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <strong>{n.hospitalName}</strong>
                  <span className={`badge ${urgencyColor(n.urgency)}`}>{n.urgency}</span>
                </div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>
                  {n.bloodGroup} • {n.distance?.toFixed(1)} km away
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={() => handleRespond(n.id, true)}>Accept</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleRespond(n.id, false)}>Decline</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent History */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📜 Recent Donations</h2>
          <Link to="/donor/history" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {history.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p>No donations recorded yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Hospital</th><th>Units</th><th>Status</th></tr></thead>
              <tbody>
                {history.slice(0, 5).map(h => (
                  <tr key={h.id}>
                    <td>{new Date(h.donationDate).toLocaleDateString('en-IN')}</td>
                    <td>{h.hospitalName}</td>
                    <td>{h.units} unit{h.units > 1 ? 's' : ''}</td>
                    <td><span className="badge badge-completed">{h.status}</span></td>
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
