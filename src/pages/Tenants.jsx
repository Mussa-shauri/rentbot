import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, Home, Calendar, X } from 'lucide-react';
import { PageWrapper, Topbar, Badge } from '../components/UI';
import { apiGetTenants, apiCreateTenant } from '../api';

export default function Tenants({ properties }) {
  const [tenants, setTenants]     = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({
    name: '', phone: '', email: '', nationalId: '',
    property: '', rentAmount: '', moveInDate: '', status: 'active',
  });

  useEffect(() => {
    apiGetTenants()
      .then(data => setTenants(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.name.trim() || !form.property) {
      alert('Please enter tenant name and select a property.'); return;
    }
    setSaving(true);
    try {
      const saved = await apiCreateTenant({
        name:        form.name,
        phone:       form.phone,
        email:       form.email,
        nationalId:  form.nationalId,
        property:    form.property,
        rentAmount:  Number(form.rentAmount),
        moveInDate:  form.moveInDate,
        status:      form.status,
      });
      setTenants(prev => [saved, ...prev]);
      setModalOpen(false);
      setForm({ name: '', phone: '', email: '', nationalId: '', property: '', rentAmount: '', moveInDate: '', status: 'active' });
    } catch {
      alert('Failed to save tenant. Is the backend running?');
    }
    setSaving(false);
  };

  const filtered = tenants.filter(t =>
    (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.property?.propertyName || '').toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '9px 11px', border: '1px solid #D3D1C7',
    borderRadius: 8, fontSize: 13.5, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#5F5E5A', marginBottom: 4, display: 'block' };

  return (
    <>
      <Topbar
        title="Tenants"
        actions={
          <button onClick={() => setModalOpen(true)} style={{ padding: '9px 18px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            + Add Tenant
          </button>
        }
      />
      <PageWrapper>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            ['Total Tenants', tenants.length],
            ['Active',        tenants.filter(t => t.status === 'active').length],
            ['Pending',       tenants.filter(t => t.status === 'pending').length],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 18px' }}>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenant name or property..." style={{ width: '100%', padding: '8px 11px 8px 32px', border: '1px solid #D3D1C7', borderRadius: 10, fontSize: 13.5, background: '#fff', outline: 'none' }} />
        </div>

        {/* Tenant list */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>Loading tenants...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 4 }}>
              {search ? 'No tenants match your search.' : 'No tenants yet.'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 20 }}>Add your first tenant using the button above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((t, i) => (
              <div key={t._id || i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, flexShrink: 0 }}>
                  {(t.name || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4 }}>{t.name}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {t.property?.propertyName && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gray-500)' }}>
                        <Home size={12} /> {t.property.propertyName}
                      </span>
                    )}
                    {t.moveInDate && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gray-500)' }}>
                        <Calendar size={12} /> Since {new Date(t.moveInDate).toLocaleDateString()}
                      </span>
                    )}
                    {t.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gray-500)' }}>
                        <Phone size={12} /> {t.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {t.rentAmount > 0 && (
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>
                      TZS {Number(t.rentAmount).toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>/mo</span>
                    </p>
                  )}
                  <Badge variant={t.status === 'active' ? 'green' : t.status === 'pending' ? 'amber' : 'gray'}>
                    {t.status || 'active'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageWrapper>

      {/* Add Tenant Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

            <div style={{ padding: '16px 20px', borderBottom: '1px solid #D3D1C7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Add New Tenant</span>
              <button onClick={() => setModalOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #D3D1C7', background: '#fff', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Full name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Amina Salehe" />
                </div>
                <div>
                  <label style={labelStyle}>Phone number</label>
                  <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+255 712 000 000" />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} placeholder="tenant@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>National ID</label>
                  <input style={inputStyle} value={form.nationalId} onChange={e => set('nationalId', e.target.value)} placeholder="ID number" />
                </div>
                <div>
                  <label style={labelStyle}>Property *</label>
                  <select style={inputStyle} value={form.property} onChange={e => set('property', e.target.value)}>
                    <option value="">Select property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Monthly rent (TZS)</label>
                  <input style={inputStyle} type="number" value={form.rentAmount} onChange={e => set('rentAmount', e.target.value)} placeholder="e.g. 450000" />
                </div>
                <div>
                  <label style={labelStyle}>Move-in date</label>
                  <input style={inputStyle} type="date" value={form.moveInDate} onChange={e => set('moveInDate', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="left">Left</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid #D3D1C7', display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#F8F8F7' }}>
              <button onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #D3D1C7', background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Add Tenant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}