import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function BloodStock() {
  const [stock, setStock] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.initStock().catch(() => {});
    adminAPI.getStock().then(({ data }) => setStock(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const startEdit = (item) => { setEditing(item.id); setEditVal(String(item.units)); };
  const cancelEdit = () => { setEditing(null); setEditVal(''); };

  const saveEdit = async (bloodGroup) => {
    try {
      const { data } = await adminAPI.updateStock(bloodGroup, parseInt(editVal));
      setStock(prev => prev.map(s => s.bloodGroup === bloodGroup ? data : s));
      setEditing(null);
      toast.success(`Stock updated for ${bloodGroup}`);
    } catch (e) {
      toast.error('Failed to update stock');
    }
  };

  const totalUnits = stock.reduce((sum, s) => sum + s.units, 0);
  const criticalCount = stock.filter(s => s.units < 30).length;

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blood Stock</h1>
          <p className="page-subtitle">Manage blood inventory across all groups</p>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
        {[
          ['📦', 'Total Units', totalUnits, '#3B82F6', '#DBEAFE'],
          ['⚠️', 'Critical Groups', criticalCount, '#EF4444', '#FEE2E2'],
          ['✅', 'Adequate Groups', stock.filter(s => s.units >= 50).length, '#10B981', '#D1FAE5'],
        ].map(([icon, label, val, color, bg]) => (
          <div key={label} className="metric-card" style={{ '--accent': color }}>
            <div className="metric-icon" style={{ background: bg, color, fontSize: 20 }}>{icon}</div>
            <div className="metric-value">{val}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="stock-grid">
        {stock.map(s => {
          const pct = Math.min(100, (s.units / 200) * 100);
          const isCritical = s.units < 30;
          const isLow = s.units < 60;
          return (
            <div key={s.id} className={`stock-card ${isCritical ? 'stock-critical' : isLow ? 'stock-low' : ''}`}>
              <div className="blood-type-badge">{s.bloodGroup}</div>
              {editing === s.id ? (
                <div>
                  <input
                    type="number"
                    className="form-input"
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    style={{ textAlign: 'center', marginBottom: 8 }}
                    min={0}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => saveEdit(s.bloodGroup)}>Save</button>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="stock-units" style={{ color: isCritical ? 'var(--red)' : 'var(--text-primary)' }}>{s.units}</div>
                  <div className="stock-label">units available</div>
                  <div style={{ margin: '10px 0', height: 6, background: '#F0F0F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: isCritical ? '#EF4444' : isLow ? '#F59E0B' : '#10B981',
                      borderRadius: 3,
                      transition: 'width 0.5s'
                    }} />
                  </div>
                  {isCritical && <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600, marginBottom: 6 }}>⚠️ CRITICAL</div>}
                  {isLow && !isCritical && <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600, marginBottom: 6 }}>LOW STOCK</div>}
                  <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => startEdit(s)}>
                    ✏️ Edit
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
