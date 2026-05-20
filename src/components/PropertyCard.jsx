import React, { useState } from 'react';
import { MapPin, Bed, Bath, Edit2, Trash2, Eye } from 'lucide-react';
import { StatusBadge, Button } from './UI';
import { CARD_COLORS, CARD_ICONS } from '../data/data';

export default function PropertyCard({ property, onDelete, onView }) {
  const [hovered, setHovered] = useState(false);
  const { id, name, type, location, price, beds, baths, status, photos, color } = property;

  const hasCover = photos && photos.length > 0;

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? 'var(--blue-mid)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      {/* Image area */}
      <div style={{
        height: 130,
        position: 'relative',
        overflow: 'hidden',
        background: hasCover ? 'transparent' : CARD_COLORS[color % 4],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {hasCover
          ? <img src={photos[0].src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <span style={{ fontSize: 40 }}>{CARD_ICONS[color % 4]}</span>
        }
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <StatusBadge status={status} />
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
          <button
            onClick={e => { e.stopPropagation(); onView(); }}
            style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="View details"
          ><Eye size={13} /></button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(id); }}
            style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Delete"
          ><Trash2 size={13} color="var(--red)" /></button>
        </div>
        {hasCover && photos.length > 1 && (
          <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99 }}>
            +{photos.length - 1} photos
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray-400)', fontSize: 12, marginBottom: 10 }}>
          <MapPin size={11} color="var(--blue)" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {[
            [<Bed size={11} />, `${beds} bed`],
            [<Bath size={11} />, `${baths} bath`],
            [null, type],
          ].map(([icon, label], i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 99,
              background: 'var(--gray-100)', color: 'var(--gray-600)', fontSize: 11.5,
            }}>
              {icon}{label}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>
              TZS {Number(price).toLocaleString()}
            </span>
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>/mo</span>
          </div>
          <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); onView(); }}>Details</Button>
        </div>
      </div>
    </div>
  );
}