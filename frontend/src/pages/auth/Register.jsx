import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const { role: roleParam } = useParams();
  const role = roleParam === 'donor' ? 'DONOR' : 'RECIPIENT';
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">🩸</div>
          <div className="auth-brand-name">Blood<span>Bank</span></div>
        </div>
        <h1 className="auth-headline">
          {role === 'DONOR' ? <>Join as a<br /><em>Life Saver</em></> : <>Find your<br /><em>Blood Hero</em></>}
        </h1>
        <p className="auth-description">
          {role === 'DONOR'
            ? 'Become a hero. Register as a donor and help save lives in your community.'
            : 'Register to request blood and get connected with verified donors near you.'}
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-form-title">
          {role === 'DONOR' ? '🩸 Donor Registration' : '🏥 Recipient Registration'}
        </div>
        <p className="auth-form-subtitle">Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-input" placeholder="Your full name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input name="phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating...</> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--red)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
