import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import DonorAvailability from './pages/donor/DonorAvailability';
import DonorHistory from './pages/donor/DonorHistory';
import DonorNotifications from './pages/donor/DonorNotifications';

import RecipientDashboard from './pages/recipient/RecipientDashboard';
import CreateRequest from './pages/recipient/CreateRequest';
import MyRequests from './pages/recipient/MyRequests';
import SmartDonors from './pages/recipient/SmartDonors';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDonors from './pages/admin/ManageDonors';
import AdminRequests from './pages/admin/AdminRequests';
import BloodStock from './pages/admin/BloodStock';
import Analytics from './pages/admin/Analytics';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'DONOR') return <Navigate to="/donor" replace />;
  return <Navigate to="/recipient" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'DM Sans, sans-serif', fontSize: 14 } }} />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />

          {/* DONOR ROUTES */}
          <Route path="/donor" element={<ProtectedRoute role="DONOR"><Layout><DonorDashboard /></Layout></ProtectedRoute>} />
          <Route path="/donor/profile" element={<ProtectedRoute role="DONOR"><Layout><DonorProfile /></Layout></ProtectedRoute>} />
          <Route path="/donor/availability" element={<ProtectedRoute role="DONOR"><Layout><DonorAvailability /></Layout></ProtectedRoute>} />
          <Route path="/donor/history" element={<ProtectedRoute role="DONOR"><Layout><DonorHistory /></Layout></ProtectedRoute>} />
          <Route path="/donor/notifications" element={<ProtectedRoute role="DONOR"><Layout><DonorNotifications /></Layout></ProtectedRoute>} />

          {/* RECIPIENT ROUTES */}
          <Route path="/recipient" element={<ProtectedRoute role="RECIPIENT"><Layout><RecipientDashboard /></Layout></ProtectedRoute>} />
          <Route path="/recipient/create-request" element={<ProtectedRoute role="RECIPIENT"><Layout><CreateRequest /></Layout></ProtectedRoute>} />
          <Route path="/recipient/my-requests" element={<ProtectedRoute role="RECIPIENT"><Layout><MyRequests /></Layout></ProtectedRoute>} />
          <Route path="/recipient/donors" element={<ProtectedRoute role="RECIPIENT"><Layout><SmartDonors /></Layout></ProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/donors" element={<ProtectedRoute role="ADMIN"><Layout><ManageDonors /></Layout></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute role="ADMIN"><Layout><AdminRequests /></Layout></ProtectedRoute>} />
          <Route path="/admin/stock" element={<ProtectedRoute role="ADMIN"><Layout><BloodStock /></Layout></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="ADMIN"><Layout><Analytics /></Layout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
