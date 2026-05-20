import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PageWrapper, Topbar, Badge } from '../components/UI';
import { PAYMENTS } from '../data/data';

export default function Payments({ properties }) {
  const [filter, setFilter] = useState('all');

  const allPayments = [
    ...PAYMENTS,
    ...properties
      .filter(p => p.status === 'occupied' && p.tenant)
      .filter(p => !PAYMENTS.some(pay => pay.property === p.name))
      .map((p, i) => ({
        id: 100 + i, tenant: p.tenant.name, property: p.name,
        amount: p.price, month: 'May 2024', status: 'upcoming', date: '2024-05-01',
      })),
  ];

  const filtered = filter === 'all' ? allPayments : allPayments.filter(p => p.status === filter);

  const paid     = allPayments.filter(p => p.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const upcoming = allPayments.filter(p => p.status === 'upcoming').reduce((a, b) => a + b.amount, 0);
  const overdue  = allPayments.filter(p => p.status === 'overdue').reduce((a, b) => a + b.amount, 0);

  const statusInfo = {
    paid:     { label: 'Paid',     icon: <CheckCircle size={13} />, variant: 'green' },
    upcoming: { label: 'Upcoming', icon: <Clock size={13} />,       variant: 'amber' },
    overdue:  { label: 'Overdue',  icon: <AlertCircle size={13} />, variant: 'red'   },
  };

  return (
    <>
      <Topbar title="Payments" />
      <PageWrapper>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { label: 'Collected this month', value: paid,     color: 'var(--green)', icon: <CheckCircle size={16} color="var(--green)" />, bg: 'var(--green-light)' },
            { label: 'Upcoming',             value: upcoming, color: 'var(--amber)', icon: <Clock size={16} color="var(--amber)" />,       bg: 'var(--amber-light)' },
            { label: 'Overdue',              value: overdue,  color: 'var(--red)',   icon: <AlertCircle size={16} color="var(--red)" />,   bg: 'var(--red-light)'   },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.icon}</div>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: 'var(--font-display)' }}>
                TZS {Number(c.value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'paid', 'upcoming', 'overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
              border: `1px solid ${filter === f ? 'var(--blue-mid)' : 'var(--border-med)'}`,
              background: filter === f ? 'var(--blue-light)' : '#fff',
              color: filter === f ? 'var(--blue)' : 'var(--gray-600)',
              fontWeight: filter === f ? 600 : 400, textTransform: 'capitalize',
            }}>{f === 'all' ? 'All payments' : f}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '10px 18px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>
            {['Tenant', 'Property', 'Amount (TZS)', 'Month', 'Status'].map(h => (
              <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p style={{ padding: '24px 18px', fontSize: 13, color: 'var(--gray-400)', textAlign: 'center' }}>No payments found.</p>
          ) : (
            filtered.map(pay => {
              const s = statusInfo[pay.status] || statusInfo.upcoming;
              return (
                <div key={pay.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '13px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--gray-800)' }}>{pay.tenant}</span>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{pay.property}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--gray-800)' }}>{Number(pay.amount).toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>{pay.month}</span>
                  <Badge variant={s.variant}>{s.label}</Badge>
                </div>
              );
            })
          )}
        </div>
      </PageWrapper>
    </>
  );
}
