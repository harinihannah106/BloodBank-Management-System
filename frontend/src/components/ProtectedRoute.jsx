import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen">
      <div>
        <div className="blood-drop-loader">🩸</div>
        <p style={{ textAlign: 'center', color: '#6B7280', marginTop: 16, fontWeight: 500 }}>Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
