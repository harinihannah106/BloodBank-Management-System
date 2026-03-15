import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipientAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = [
  { value: 'NORMAL', label: '🟢 Normal', desc: 'Scheduled or non-urgent procedure' },
  { value: 'HIGH', label: '🟡 High', desc: 'Required within 24-48 hours' },
  { value: 'EMERGENCY', label: '🚨 Emergency', desc: 'Critical — needed immediately' },
];

export default function CreateRequest() {
  const [form, setForm] = useState({
    bloodGroup: '', units: 1, hospitalName: '', contactNumber: '',
    urgency: 'NORMAL', requiredDate: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recipientAPI.createRequest(form);
      toast.success('Blood request submitted successfully!');
      navigate('/recipient/my-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Blood Request</h1>
          <p className="page-subtitle">Submit a request and get connected with donors</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Blood Group Required *</label>
                <select name="bloodGroup" className="form-select" value={form.bloodGroup} onChange={handleChange} required>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Units Required *</label>
                <input name="units" type="number" min={1} max={10} className="form-input" value={form.units} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Name *</label>
              <input name="hospitalName" className="form-input" placeholder="e.g. KMCH, Ganga Hospital" value={form.hospitalName} onChange={handleChange} required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Contact Number *</label>
                <input name="contactNumber" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.contactNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Required By Date</label>
                <input name="requiredDate" type="date" className="form-input" value={form.requiredDate} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Level *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {URGENCY_LEVELS.map(({ value, label, desc }) => (
                  <div
                    key={value}
                    onClick={() => setForm(p => ({ ...p, urgency: value }))}
                    style={{
                      padding: '14px',
                      border: `2px solid ${form.urgency === value ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: form.urgency === value ? 'var(--red-pale)' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea name="notes" className="form-textarea" placeholder="Any special requirements or additional information..." value={form.notes} onChange={handleChange} rows={3} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Submitting...</> : '🩸 Submit Request'}
            </button>
          </form>
        </div>

        <div>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--red) 0%, var(--red-dark) 100%)', color: 'white' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 16 }}>How it works</h3>
            {[
              ['1', 'Submit your blood request with required details'],
              ['2', 'Compatible donors in your area are notified'],
              ['3', 'Admin reviews and approves your request'],
              ['4', 'Donor is assigned and contacts you'],
            ].map(([num, text]) => (
              <div key={num} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{num}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>{text}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, marginBottom: 12 }}>Blood Type Compatibility</h3>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--red)' }}>O-</strong> → Universal donor<br />
              <strong style={{ color: 'var(--red)' }}>AB+</strong> → Universal recipient<br />
              <strong style={{ color: 'var(--red)' }}>O+</strong> → Most common
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
