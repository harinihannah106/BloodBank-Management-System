import { useState, useEffect } from 'react';
import { donorAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorProfile() {
  const [form, setForm] = useState({
    bloodGroup: '', age: '', weight: '', city: '',
    address: '', phone: '', latitude: 0, longitude: 0
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    donorAPI.getProfile()
      .then(({ data }) => setForm({
        bloodGroup: data.bloodGroup || '',
        age: data.age || '',
        weight: data.weight || '',
        city: data.city || '',
        address: data.address || '',
        phone: data.phone || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0
      }))
      .catch(() => {});
  }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await donorAPI.saveProfile(form);
      toast.success('Profile saved successfully!');
      setSaved(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Complete your donor profile to receive blood requests</p>
        </div>
      </div>

      {saved && <div className="alert alert-success">✓ Profile updated successfully!</div>}

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select name="bloodGroup" className="form-select" value={form.bloodGroup} onChange={handleChange} required>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input name="phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input name="age" type="number" className="form-input" placeholder="18-65" min={18} max={65} value={form.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input name="weight" type="number" className="form-input" placeholder="Min 50 kg" min={50} value={form.weight} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">City *</label>
            <input name="city" className="form-input" placeholder="e.g. Coimbatore, Chennai" value={form.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Full Address</label>
            <textarea name="address" className="form-textarea" placeholder="Your full address (optional)" value={form.address} onChange={handleChange} rows={2} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Saving...</> : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
