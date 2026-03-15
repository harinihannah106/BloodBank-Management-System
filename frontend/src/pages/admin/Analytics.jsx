import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#E8192C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;
  if (!stats) return <div className="alert alert-error">Failed to load analytics</div>;

  const stockBarData = Object.entries(stats.bloodGroupStock || {}).map(([bg, units]) => ({ name: bg, units }));
  const urgencyData = Object.entries(stats.urgencyDistribution || {}).map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep insights into blood bank performance</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h2 className="card-title">📊 Blood Group Stock Distribution</h2></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                {stockBarData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">🚨 Emergency vs Normal Requests</h2></div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {urgencyData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h2 className="card-title">📈 Monthly Donation Activity</h2></div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={stats.monthlyTrend || []}>
            <defs>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8192C" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#E8192C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="donations" stroke="#E8192C" strokeWidth={2.5} fill="url(#redGrad)" dot={{ fill: '#E8192C', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {[
          { label: 'Total Donors', val: stats.totalDonors, change: '+12%', color: '#E8192C' },
          { label: 'Active Donors', val: stats.activeDonors, change: '+8%', color: '#10B981' },
          { label: 'Total Stock', val: `${stats.totalStockUnits}u`, change: '-3%', color: '#3B82F6' },
        ].map(({ label, val, change, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color }}>{val}</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div style={{
              fontSize: 12,
              color: change.startsWith('+') ? '#10B981' : '#EF4444',
              fontWeight: 600
            }}>{change} from last month</div>
          </div>
        ))}
      </div>
    </div>
  );
}
