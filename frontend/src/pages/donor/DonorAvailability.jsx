import { useState, useEffect } from 'react';
import { donorAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function DonorAvailability() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    donorAPI.getProfile().then(({ data }) => setProfile(data)).catch(() => {});
  }, []);

  const toggle = async (val) => {
    setLoading(true);
    try {
      const { data } = await donorAPI.toggleAvailability(val);
      setProfile(data);
      toast.success(val ? '🟢 You are now available!' : '🔴 Marked as unavailable');
    } catch (e) {
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return (
    <div>
      <div className="page-header"><h1 className="page-title">Availability</h1></div>
      <div className="alert alert-warning">Please complete your donor profile first.</div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Availability</h1>
          <p className="page-subtitle">Control when you're available to donate blood</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 120, height: 120,
            background: profile.available ? '#D1FAE5' : '#FEE2E2',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 48,
            border: `4px solid ${profile.available ? '#10B981' : '#EF4444'}`,
            transition: 'all 0.3s'
          }}>
            {profile.available ? '🟢' : '🔴'}
          </div>

          <h2 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {profile.available ? 'Currently Available' : 'Currently Unavailable'}
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 28, fontSize: 14 }}>
            {profile.available
              ? 'You are visible to recipients and may receive donation requests.'
              : 'You are hidden from recipients and will not receive requests.'}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              className="btn btn-success"
              onClick={() => toggle(true)}
              disabled={loading || profile.available}
              style={{ opacity: profile.available ? 0.5 : 1 }}
            >
              🟢 Set Available
            </button>
            <button
              className="btn btn-danger"
              onClick={() => toggle(false)}
              disabled={loading || !profile.available}
              style={{ opacity: !profile.available ? 0.5 : 1 }}
            >
              🔴 Set Unavailable
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Blood Group', profile.bloodGroup],
              ['Eligibility', profile.eligible ? '✓ Eligible' : '✗ Ineligible'],
              ['Total Donations', profile.totalDonations],
              ['Next Eligible', profile.nextEligibleDate ? new Date(profile.nextEligibleDate).toLocaleDateString('en-IN') : 'Now'],
            ].map(([label, val]) => (
              <div key={label} style={{ background: '#F7F8FC', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
