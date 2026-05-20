import React, { useState } from 'react';
import { Search, Phone, Home, Calendar } from 'lucide-react';
import { PageWrapper, Topbar, Badge } from '../components/UI';

export default function Tenants({ properties }) {
  const [search, setSearch] = useState('');

  const tenants = properties
    .filter(p => p.status === 'occupied' && p.tenant)
    .map(p => ({ ...p.tenant, property: p.name, location: p.location, rent: p.price, propId: p.id }));

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Topbar title="Tenants" />
      <PageWrapper>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            ['Total Tenants', tenants.length],
            ['Active Leases', tenants.length],
            ['Avg. Rent (TZS)', tenants.length > 0 ? Math.round(tenants.reduce((a,b)=>a+b.rent,0)/tenants.length).toLocaleString() : '0'],
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
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tenant name or property..."
            style={{ width: '100%', padding: '8px 11px 8px 32px', border: '1px solid var(--border-med)', borderRadius: 'var(--r-md)', fontSize: 13.5, background: '#fff', outline: 'none' }}
          />
        </div>

        {/* Tenant cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-600)', marginBottom: 4 }}>
              {search ? 'No tenants match your search.' : 'No tenants yet.'}
            </p>
            <p style={{ fontSize: 13 }}>Tenants appear here when a property status is set to Occupied.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, flexShrink: 0 }}>
                  {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4 }}>{t.name}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gray-500)' }}>
                      <Home size={12} /> {t.property}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gray-500)' }}>
                      <Calendar size={12} /> Since {t.since}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--gray-500)' }}>
                      <Phone size={12} /> {t.contact}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>TZS {Number(t.rent).toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)' }}>/mo</span></p>
                  <Badge variant="green">Active</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
