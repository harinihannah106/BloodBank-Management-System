import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Calendar, History, Bell, LogOut,
  PlusCircle, ClipboardList, Users2, Droplets, BarChart3, Heart
} from 'lucide-react';

const donorLinks = [
  { to: '/donor', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/donor/profile', label: 'My Profile', icon: User },
  { to: '/donor/availability', label: 'Availability', icon: Calendar },
  { to: '/donor/history', label: 'Donation History', icon: History },
  { to: '/donor/notifications', label: 'Notifications', icon: Bell },
];

const recipientLinks = [
  { to: '/recipient', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recipient/create-request', label: 'Create Request', icon: PlusCircle },
  { to: '/recipient/my-requests', label: 'My Requests', icon: ClipboardList },
  { to: '/recipient/donors', label: 'Smart Suggestions', icon: Heart },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/donors', label: 'Manage Donors', icon: Users2 },
  { to: '/admin/requests', label: 'Blood Requests', icon: ClipboardList },
  { to: '/admin/stock', label: 'Blood Stock', icon: Droplets },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'DONOR' ? donorLinks
    : user?.role === 'RECIPIENT' ? recipientLinks
    : adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🩸</div>
          <div className="logo-text">Blood Availability<span> & Response</span></div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 8px' }}>
        <div className="sidebar-role-badge">{user?.role}</div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info-text" style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px', marginTop: 8,
            background: 'rgba(232, 25, 44, 0.1)',
            border: '1px solid rgba(232, 25, 44, 0.2)',
            borderRadius: 8, color: '#FF6B7A', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
