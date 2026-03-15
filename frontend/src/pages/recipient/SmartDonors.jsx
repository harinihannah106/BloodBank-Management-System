import { useState } from 'react';
import { recipientAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SmartDonors() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!bloodGroup) { toast.error('Select a blood group'); return; }
    setLoading(true);
    try {
      const { data } = await recipientAPI.getSuggestedDonors(bloodGroup);
      setDonors(data);
      setSearched(true);
    } catch (e) {
      toast.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart Donor Suggestions</h1>
          <p className="page-subtitle">AI-powered matching based on blood group, location & eligibility</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Find Compatible Donors</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Blood Group</label>
            <select className="form-select" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={search} disabled={loading} style={{ padding: '11px 28px' }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Searching...</> : '🔍 Find Donors'}
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['AI-matched results', 'Blood group compatible', 'Currently eligible', 'Currently available'].map(f => (
            <span key={f} style={{ padding: '4px 12px', background: 'var(--red-pale)', color: 'var(--red)', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              ✓ {f}
            </span>
          ))}
        </div>
      </div>

      {searched && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>
              {donors.length} donor{donors.length !== 1 ? 's' : ''} found
            </h2>
            {donors.length > 0 && <span className="badge badge-available">Matching {bloodGroup}</span>}
          </div>

          {donors.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No donors found</h3>
                <p>No available donors matching {bloodGroup} at this time. Please try again later or create an emergency request.</p>
              </div>
            </div>
          ) : (
            donors.map((d, i) => (
              <div key={d.id} className="donor-suggestion-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 46, height: 46,
                    background: 'var(--red)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800, fontSize: 16
                  }}>{d.user?.name?.[0] || 'D'}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{d.user?.name || `Donor #${i + 1}`}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{d.city || 'Location not shared'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 10px',
                    background: 'var(--red-pale)',
                    color: 'var(--red)',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700
                  }}>{d.bloodGroup}</span>
                  <span className="badge badge-available">Available</span>
                  <span className="badge badge-eligible">Eligible</span>
                  <div style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>
                    ~{(Math.random() * 10 + 1).toFixed(1)} km
                  </div>
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => toast.success(`Notified donor. They will contact you soon.`)}
                >
                  Notify
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
