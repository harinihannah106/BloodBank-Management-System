import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

export default function ManageDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getDonors().then(({ data }) => setDonors(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleBlock = async (id, blocked) => {
    try {
      const action = blocked ? adminAPI.unblockUser(id) : adminAPI.blockUser(id);
      const { data } = await action;
      setDonors(prev => prev.map(d => d.id === id ? data : d));
      toast.success(blocked ? 'User unblocked' : 'User blocked');
    } catch (e) {
      toast.error('Action failed');
    }
  };

  const filtered = donors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.bloodGroup?.includes(search)
  );

  if (loading) return <div className="loading-screen"><div className="blood-drop-loader">🩸</div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Donors</h1>
          <p className="page-subtitle">{donors.length} registered donors</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            className="form-input"
            placeholder="Search by name, email or blood group..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>No donors found</td></tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34,
                          background: d.blocked ? '#F3F4F6' : 'var(--red-pale)',
                          color: d.blocked ? '#9CA3AF' : 'var(--red)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 14
                        }}>{d.name?.[0]}</div>
                        <strong>{d.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: '#6B7280' }}>{d.email}</td>
                    <td>
                      {d.bloodGroup ? (
                        <span style={{
                          background: 'var(--red-pale)', color: 'var(--red)',
                          padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontSize: 13
                        }}>{d.bloodGroup}</span>
                      ) : '—'}
                    </td>
                    <td style={{ color: '#6B7280' }}>{d.phone || '—'}</td>
                    <td>
                      <span className={`badge ${d.blocked ? 'badge-rejected' : 'badge-available'}`}>
                        {d.blocked ? '🚫 Blocked' : '✓ Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className={`btn btn-sm ${d.blocked ? 'btn-success' : 'btn-danger'}`}
                          onClick={() => toggleBlock(d.id, d.blocked)}
                        >
                          {d.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
