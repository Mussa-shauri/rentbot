import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PageWrapper, Topbar, Badge } from '../components/UI';
import { apiGetPayments, apiCreatePayment, apiDeletePayment } from '../api';

export default function Payments({ properties }) {
  const [payments, setPayments]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    tenantName:     '',
    property:       '',
    amount:         '',
    paymentDate:    '',
    paymentMethod:  'Cash',
    periodStart:    '',
    periodEnd:      '',
    durationMonths: '1',
    notes:          '',
    status:         'paid',
  });

  useEffect(() => {
    apiGetPayments()
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleStartOrDuration = (key, val) => {
    set(key, val);
    const start    = key === 'periodStart'    ? val : form.periodStart;
    const duration = key === 'durationMonths' ? val : form.durationMonths;
    if (start && duration) {
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + Number(duration));
      set('periodEnd', endDate.toISOString().split('T')[0]);
    }
  };

  const handleAdd = async () => {
    if (!form.tenantName.trim() || !form.amount) {
      alert('Please enter tenant name and amount.'); return;
    }
    setSaving(true);
    try {
      const saved = await apiCreatePayment({
        tenantName:     form.tenantName,
        property:       form.property || undefined,
        amount:         Number(form.amount),
        paymentDate:    form.paymentDate || new Date().toISOString(),
        paymentMethod:  form.paymentMethod,
        periodStart:    form.periodStart || undefined,
        periodEnd:      form.periodEnd   || undefined,
        durationMonths: Number(form.durationMonths) || 1,
        notes:          form.notes,
        status:         form.status,
      });
      setPayments(prev => [saved.payment || saved, ...prev]);
      setModalOpen(false);
      setForm({ tenantName: '', property: '', amount: '', paymentDate: '', paymentMethod: 'Cash', periodStart: '', periodEnd: '', durationMonths: '1', notes: '', status: 'paid' });
    } catch {
      alert('Failed to save payment.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    try {
      await apiDeletePayment(id);
      setPayments(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete.');
    }
  };

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
  const paid    = payments.filter(p => p.status === 'paid').reduce((a, b) => a + (b.amount || 0), 0);
  const pending = payments.filter(p => p.status === 'pending').reduce((a, b) => a + (b.amount || 0), 0);

  const formatPeriod = (pay) => {
    if (pay.periodStart && pay.periodEnd) {
      const start = new Date(pay.periodStart).toLocaleDateString('en', { month: 'short', year: 'numeric' });
      const end   = new Date(pay.periodEnd).toLocaleDateString('en', { month: 'short', year: 'numeric' });
      return `${start} → ${end}`;
    }
    if (pay.durationMonths) return `${pay.durationMonths} month${pay.durationMonths > 1 ? 's' : ''}`;
    return '—';
  };

  const inputStyle = {
    width: '100%', padding: '9px 11px', border: '1px solid #D3D1C7',
    borderRadius: 8, fontSize: 13.5, outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#5F5E5A', marginBottom: 4, display: 'block' };

  return (
    <>
      <Topbar
        title="Payments"
        actions={
          <button onClick={() => setModalOpen(true)} style={{ padding: '9px 18px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Record Payment
          </button>
        }
      />
      <PageWrapper>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { label: 'Total collected', value: `TZS ${paid.toLocaleString()}`,    color: 'var(--green)', icon: <CheckCircle size={16} color="var(--green)" />, bg: 'var(--green-light)' },
            { label: 'Pending',         value: `TZS ${pending.toLocaleString()}`, color: 'var(--amber)', icon: <Clock size={16} color="var(--amber)" />,       bg: 'var(--amber-light)' },
            { label: 'Total records',   value: payments.length,                   color: 'var(--blue)',  icon: <CheckCircle size={16} color="var(--blue)" />,  bg: 'var(--blue-light)'  },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: 'var(--font-display)' }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'paid', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
              border: `1px solid ${filter === f ? '#85B7EB' : '#D3D1C7'}`,
              background: filter === f ? '#E6F1FB' : '#fff',
              color: filter === f ? '#185FA5' : '#5F5E5A',
              fontWeight: filter === f ? 600 : 400, fontFamily: 'inherit', textTransform: 'capitalize',
            }}>{f === 'all' ? 'All payments' : f}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr auto', padding: '10px 18px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
            {['Tenant', 'Property', 'Amount (TZS)', 'Period', 'Status', ''].map(h => (
              <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {loading ? (
            <p style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>Loading payments...</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>No payments found.</p>
          ) : (
            filtered.map(pay => (
              <div key={pay._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr auto', padding: '13px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{pay.tenantName || pay.tenant?.name || '—'}</span>
                <span style={{ fontSize: 13, color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{pay.property?.propertyName || '—'}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{Number(pay.amount || 0).toLocaleString()}</span>
                <span style={{ fontSize: 12.5, color: 'var(--gray-600)' }}>{formatPeriod(pay)}</span>
                <Badge variant={pay.status === 'paid' ? 'green' : 'amber'}>{pay.status}</Badge>
                <button onClick={() => handleDelete(pay._id)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #D3D1C7', background: '#fff', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
              </div>
            ))
          )}
        </div>
      </PageWrapper>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

            <div style={{ padding: '16px 20px', borderBottom: '1px solid #D3D1C7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Record Payment</span>
              <button onClick={() => setModalOpen(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #D3D1C7', background: '#fff', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Tenant name *</label>
                  <input style={inputStyle} value={form.tenantName} onChange={e => set('tenantName', e.target.value)} placeholder="e.g. Amina Salehe" />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Property</label>
                  <select style={inputStyle} value={form.property} onChange={e => set('property', e.target.value)}>
                    <option value="">Select property</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Amount (TZS) *</label>
                  <input style={inputStyle} type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="e.g. 450000" />
                </div>

                <div>
                  <label style={labelStyle}>Payment method</label>
                  <select style={inputStyle} value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
                    <option>Cash</option>
                    <option>Mobile Money</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Payment date</label>
                  <input style={inputStyle} type="date" value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} />
                </div>

                <div>
                  <label style={labelStyle}>Duration (months)</label>
                  <select style={inputStyle} value={form.durationMonths} onChange={e => handleStartOrDuration('durationMonths', e.target.value)}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                      <option key={n} value={n}>{n} month{n > 1 ? 's' : ''}{n === 12 ? ' (1 year)' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Period start date</label>
                  <input style={inputStyle} type="date" value={form.periodStart} onChange={e => handleStartOrDuration('periodStart', e.target.value)} />
                </div>

                <div>
                  <label style={labelStyle}>Period end date</label>
                  <input style={inputStyle} type="date" value={form.periodEnd} onChange={e => set('periodEnd', e.target.value)} />
                  {form.periodStart && form.durationMonths && (
                    <p style={{ fontSize: 11, color: 'var(--green)', marginTop: 4 }}>✓ Auto-calculated from start date + duration</p>
                  )}
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Notes (optional)</label>
                  <input style={inputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Paid via M-Pesa ref #12345" />
                </div>

              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid #D3D1C7', display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#F8F8F7', flexShrink: 0 }}>
              <button onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #D3D1C7', background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Record Payment'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}