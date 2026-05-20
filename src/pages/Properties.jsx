import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageWrapper, Topbar, StatCard } from '../components/UI';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import ListPropertyModal from '../components/ListPropertyModal';

const FILTERS = ['All', 'Available', 'Occupied', 'Pending'];

export default function Properties({ properties = [], setProperties, showToast }) {
  const [filter, setFilter]         = useState('All');
  const [search, setSearch]         = useState('');
  const [listOpen, setListOpen]     = useState(false);
  const [detailProp, setDetailProp] = useState(null);

  const filtered = properties.filter(p => {
    const matchFilter = filter === 'All' || p.status === filter.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAdd = form => {
    const newProp = {
      ...form,
      id: Date.now(),
      color: properties.length % 4,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setProperties(prev => [newProp, ...prev]);
    if (showToast) showToast('Property listed successfully!');
  };

  const handleDelete = id => {
    if (window.confirm('Remove this property?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
      if (showToast) showToast('Property removed.');
    }
  };

  return (
    <>
      <Topbar
        title="My Properties"
        actions={
          <button
            onClick={() => setListOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', background: '#185FA5', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 13.5,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + List Property
          </button>
        }
      />
      <PageWrapper>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          <StatCard label="Total"     value={properties.length} sub="All listings" />
          <StatCard label="Available" value={properties.filter(p => p.status === 'available').length} sub="Ready for tenants" subColor="var(--green)" />
          <StatCard label="Occupied"  value={properties.filter(p => p.status === 'occupied').length}  sub="Active tenants" />
          <StatCard label="Pending"   value={properties.filter(p => p.status === 'pending').length}   sub="Under review" subColor="var(--amber)" />
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              style={{ width: '100%', padding: '8px 11px 8px 32px', border: '1px solid #D3D1C7', borderRadius: 10, fontSize: 13.5, background: '#fff', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 14px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
                border: `1px solid ${filter === f ? '#85B7EB' : '#D3D1C7'}`,
                background: filter === f ? '#E6F1FB' : '#fff',
                color: filter === f ? '#185FA5' : '#5F5E5A',
                fontWeight: filter === f ? 600 : 400, fontFamily: 'inherit',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🏠</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#5F5E5A', marginBottom: 8 }}>
              {search ? 'No properties match your search.' : 'No properties listed yet.'}
            </p>
            <p style={{ fontSize: 13, color: '#888780', marginBottom: 24 }}>
              Add your first property using the button below.
            </p>
            <button
              onClick={() => setListOpen(true)}
              style={{ padding: '10px 22px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + List your first property
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filtered.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                onDelete={handleDelete}
                onView={() => setDetailProp(p)}
              />
            ))}
          </div>
        )}

      </PageWrapper>

      <ListPropertyModal
        open={listOpen}
        onClose={() => setListOpen(false)}
        onSubmit={handleAdd}
      />

      <PropertyDetailModal
        property={detailProp}
        open={!!detailProp}
        onClose={() => setDetailProp(null)}
      />
    </>
  );
}