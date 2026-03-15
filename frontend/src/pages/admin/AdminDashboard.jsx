import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Droplets, Users, Package, AlertCircle, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#E8192C', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
    adminAPI.initStock().catch(() => {});
  }, []);

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;
  if (!stats) return <div className="alert alert-error">Failed to load stats</div>;

  const stockBarData = Object.entries(stats.bloodGroupStock || {}).map(([bg, units]) => ({ name: bg, units }));
  const urgencyData = Object.entries(stats.urgencyDistribution || {}).map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Real-time overview of the blood bank system</p>
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', padding: '8px 14px', background: 'white', borderRadius: 8, border: '1px solid var(--border)' }}>
          🕐 Live · {new Date().toLocaleTimeString('en-IN')}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        {[
          { icon: Users, label: 'Total Donors', value: stats.totalDonors, color: '#E8192C', bg: '#FFF0F2', desc: 'Registered' },
          { icon: Users, label: 'Active Donors', value: stats.activeDonors, color: '#10B981', bg: '#D1FAE5', desc: 'Available & eligible' },
          { icon: Package, label: 'Total Stock', value: `${stats.totalStockUnits}u`, color: '#3B82F6', bg: '#DBEAFE', desc: 'Units available' },
          { icon: AlertCircle, label: 'Critical Today', value: stats.criticalCasesToday, color: '#EF4444', bg: '#FEE2E2', desc: 'Emergency cases' },
          { icon: Clock, label: 'Avg Response', value: `${stats.avgResponseTime}h`, color: '#F59E0B', bg: '#FEF3C7', desc: 'Response time' },
        ].map(({ icon: Icon, label, value, color, bg, desc }) => (
          <div key={label} className="metric-card" style={{ '--accent': color }}>
            <div className="metric-icon" style={{ background: bg, color }}><Icon size={20} /></div>
            <div className="metric-value">{value}</div>
            <div className="metric-label" style={{ fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📊 Blood Stock by Type</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stockBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontFamily: 'DM Sans' }} />
              <Bar dataKey="units" fill="#E8192C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🚨 Request Urgency</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {urgencyData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend formatter={(value) => <span style={{ fontSize: 12, fontFamily: 'DM Sans' }}>{value}</span>} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📈 Monthly Donation Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats.monthlyTrend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontFamily: 'DM Sans' }} />
            <Line type="monotone" dataKey="donations" stroke="#E8192C" strokeWidth={2.5} dot={{ fill: '#E8192C', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Request Overview</h3>
          {[
            ['Total Requests', stats.totalRequests, '#3B82F6'],
            ['Pending', stats.pendingRequests, '#F59E0B'],
            ['Critical Today', stats.criticalCasesToday, '#E8192C'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color }}>{val}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Critical Stock Levels</h3>
          {stockBarData.filter(s => s.units < 50).map(s => (
            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, background: 'var(--red-pale)', color: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{s.name}</div>
                <span style={{ fontSize: 14 }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(s.units, 100)}%`, background: s.units < 20 ? '#EF4444' : '#F59E0B', borderRadius: 3 }} />
                </div>
                <span style={{ fontWeight: 700, color: s.units < 20 ? '#EF4444' : '#F59E0B', fontSize: 14 }}>{s.units}u</span>
              </div>
            </div>
          ))}
          {stockBarData.filter(s => s.units < 50).length === 0 && <p style={{ color: '#6B7280', fontSize: 14 }}>All blood groups have adequate stock.</p>}
        </div>
      </div>
    </div>
  );
}
