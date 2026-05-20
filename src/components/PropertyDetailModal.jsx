import React, { useState } from 'react';
import { MapPin, Bed, Bath, Phone, Video, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Modal, StatusBadge, Badge, Button } from './UI';
import { CARD_COLORS, CARD_ICONS } from '../data/data';

export default function PropertyDetailModal({ property, open, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  if (!property) return null;
  const { name, type, location, price, deposit, beds, baths, status, desc, amenities, phone, photos, videos, color, tenant, dateAdded } = property;

  const hasPhotos = photos && photos.length > 0;

  const prevPhoto = () => setPhotoIdx(i => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhotoIdx(i => (i + 1) % photos.length);

  const getVideoSource = url => {
    if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('tiktok')) return 'TikTok';
    if (url.includes('drive.google')) return 'Google Drive';
    if (url.includes('vimeo')) return 'Vimeo';
    return 'Video';
  };

  return (
    <Modal open={open} onClose={onClose} title={name} width={580}>
      {/* Photo gallery */}
      <div style={{ position: 'relative', height: 220, background: hasPhotos ? '#000' : CARD_COLORS[color % 4], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hasPhotos ? (
          <>
            <img src={photos[photoIdx].src} alt={`photo ${photoIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {photos.length > 1 && (
              <>
                <button onClick={prevPhoto} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextPhoto} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronRight size={16} />
                </button>
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                  {photos.map((_, i) => (
                    <div key={i} onClick={() => setPhotoIdx(i)} style={{ width: i === photoIdx ? 16 : 6, height: 6, borderRadius: 99, background: i === photoIdx ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'width 0.2s' }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99 }}>
                  {photoIdx + 1} / {photos.length}
                </div>
              </>
            )}
          </>
        ) : (
          <span style={{ fontSize: 52 }}>{CARD_ICONS[color % 4]}</span>
        )}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Thumbnail strip */}
      {hasPhotos && photos.length > 1 && (
        <div style={{ display: 'flex', gap: 6, padding: '10px 20px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {photos.map((p, i) => (
            <img key={i} src={p.src} alt="" onClick={() => setPhotoIdx(i)} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: `2px solid ${i === photoIdx ? 'var(--blue)' : 'transparent'}`, flexShrink: 0 }} />
          ))}
        </div>
      )}

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '2px 8px', borderRadius: 99 }}>{type}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray-500)', fontSize: 13 }}>
            <MapPin size={13} color="var(--blue)" />
            {location}
          </div>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', gap: 20, padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>Monthly rent</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>TZS {Number(price).toLocaleString()}</p>
          </div>
          {deposit && (
            <div>
              <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>Security deposit</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-700)', fontFamily: 'var(--font-display)' }}>TZS {Number(deposit).toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Specs */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            [<Bed size={14} />, `${beds} bedroom${beds !== '1' && beds !== 'Studio' ? 's' : ''}`],
            [<Bath size={14} />, `${baths} bathroom${baths !== '1' ? 's' : ''}`],
          ].map(([icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--gray-700)' }}>
              {icon} {label}
            </div>
          ))}
        </div>

        {/* Description */}
        {desc && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }}>Description</p>
            <p style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.7 }}>{desc}</p>
          </div>
        )}

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 8 }}>Amenities</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {amenities.map(a => <Badge key={a} variant="blue">{a}</Badge>)}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 8 }}>Video tours</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {videos.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--amber-light)', textDecoration: 'none' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--amber-light)', border: '1px solid var(--amber-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={14} color="var(--amber)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)' }}>{getVideoSource(url)}</p>
                    <p style={{ fontSize: 11, color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tenant */}
        {tenant && (
          <div style={{ padding: 14, background: 'var(--green-light)', borderRadius: 'var(--r-md)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', marginBottom: 8 }}>Current tenant</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
              {[['Name', tenant.name], ['Tenant since', tenant.since], ['Contact', tenant.contact]].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 11, color: 'var(--green)' }}>{k}</p>
                  <p style={{ fontSize: 13, color: 'var(--gray-800)' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--r-md)' }}>
            <Phone size={14} color="var(--gray-400)" />
            <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{phone}</span>
          </div>
        )}

        <div style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'right' }}>Listed on: {dateAdded || 'N/A'}</div>
      </div>
    </Modal>
  );
}