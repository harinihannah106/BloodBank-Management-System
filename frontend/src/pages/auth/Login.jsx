import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      login({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileCompleted: data.profileCompleted
      }, data.token);

      toast.success(`Welcome back, ${data.name}!`);

      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'DONOR') navigate('/donor');
      else navigate('/recipient');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">🩸</div>
          <div className="auth-brand-name">Blood Availability<span> & Emergency Response System</span></div>
        </div>
        <h1 className="auth-headline">
          Save lives<br /><em>Every drop</em><br />counts
        </h1>
        <p className="auth-description">
          Blood Availability & Emergency Response platform connecting donors and recipients for faster, life-saving responses.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 40, position: 'relative', zIndex: 1 }}>
          {[['1,250+', 'Registered Donors'], ['890', 'Lives Saved'], ['24/7', 'Emergency Support']].map(([val, label]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '16px 20px',
              flex: 1,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'white' }}>{val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-title">Welcome back</div>
        <p className="auth-form-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="section-divider">
          <span>New to the platform?</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link to="/register/donor" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 13 }}>
            🩸 Register as Donor
          </Link>
          <Link to="/register/recipient" className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: 13 }}>
            🏥 Register as Recipient
          </Link>
        </div>
      </div>
    </div>
  );
}
