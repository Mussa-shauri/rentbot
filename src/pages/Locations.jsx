import React from 'react';
import { MapPin, Home } from 'lucide-react';
import { PageWrapper, Topbar } from '../components/UI';

export default function Locations({ properties }) {
  // Group properties by city/area
  const groups = properties.reduce((acc, p) => {
    const area = p.location.split(',').slice(-1)[0].trim();
    if (!acc[area]) acc[area] = [];
    acc[area].push(p);
    return acc;
  }, {});

  const statusColor = s => ({ available: 'var(--green)', occupied: 'var(--red)', pending: 'var(--amber)' }[s] || 'var(--gray-400)');

  return (
    <>
      <Topbar title="Locations" />
      <PageWrapper>

        <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-mid)', borderRadius: 'var(--r-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <MapPin size={16} color="var(--blue)" />
          <p style={{ fontSize: 13, color: 'var(--blue-dark)' }}>
            Your properties are spread across <strong>{Object.keys(groups).length}</strong> area{Object.keys(groups).length !== 1 ? 's' : ''} in Dar es Salaam.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(groups).map(([area, props]) => (
            <div key={area} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={15} color="var(--blue)" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{area}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{props.length} propert{props.length !== 1 ? 'ies' : 'y'}</p>
                </div>
              </div>
              <div>
                {props.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: ['#E6F1FB','#E1F5EE','#FAEEDA','#FBEAF0'][p.color % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {['🏢','🏠','🏡','🏗️'][p.color % 4]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--gray-800)' }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{p.location}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--blue)' }}>TZS {Number(p.price).toLocaleString()}<span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 400 }}>/mo</span></p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: statusColor(p.status) }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor(p.status) }} />
                        <span style={{ textTransform: 'capitalize' }}>{p.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groups).length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-600)' }}>No properties listed yet.</p>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
