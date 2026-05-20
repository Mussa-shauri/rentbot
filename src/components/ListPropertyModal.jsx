import React, { useState, useRef } from 'react';

const STEPS = ['Basic Details', 'Amenities', 'Photos & Videos', 'Review & Submit'];

const AMENITY_OPTIONS = [
  'Water 24hr', 'Electricity', 'WIFI', 'Security Guard', 'Parking',
  'Generator', 'CCTV', 'Furnished', 'Air Condition', 'Near School',
  'Near Hospital', 'Garden', 'Swimming Pool', 'Balcony', 'Pet Friendly', 'Near Bus Stand',
];

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio', 'Room', 'Villa', 'Bedsitter'];

const emptyForm = {
  name: '', type: 'Apartment', status: 'available',
  location: '', price: '', deposit: '',
  beds: '1', baths: '1', desc: '', phone: '',
  amenities: [], photos: [], videos: [],
};

const inputStyle = {
  width: '100%', padding: '9px 11px',
  border: '1px solid #D3D1C7', borderRadius: 8,
  fontSize: 13.5, color: '#2C2C2A',
  background: '#fff', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: 12, fontWeight: 600,
  color: '#5F5E5A', marginBottom: 4, display: 'block',
};

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 4 };
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

// ── Step 0 ────────────────────────────────────────────────────────────────
function Step0({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Property name *</label>
        <input
          style={inputStyle}
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Msasani 3-Bedroom Apartment"
        />
      </div>

      <div style={row2}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Property type</label>
          <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
            {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Location / address *</label>
        <input
          style={inputStyle}
          value={form.location}
          onChange={e => set('location', e.target.value)}
          placeholder="e.g. Mikocheni, Dar es Salaam"
        />
      </div>

      <div style={row2}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Monthly rent (TZS) *</label>
          <input
            style={inputStyle}
            type="number"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="e.g. 450000"
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Security deposit (TZS)</label>
          <input
            style={inputStyle}
            type="number"
            value={form.deposit}
            onChange={e => set('deposit', e.target.value)}
            placeholder="e.g. 900000"
          />
        </div>
      </div>

      <div style={row2}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Bedrooms</label>
          <select style={inputStyle} value={form.beds} onChange={e => set('beds', e.target.value)}>
            {['Studio', '1', '2', '3', '4+'].map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Bathrooms</label>
          <select style={inputStyle} value={form.baths} onChange={e => set('baths', e.target.value)}>
            {['1', '2', '3'].map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description for tenants</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 85, lineHeight: 1.6 }}
          value={form.desc}
          onChange={e => set('desc', e.target.value)}
          placeholder="Describe the property — size, condition, nearby facilities, neighbourhood..."
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Contact phone number</label>
        <input
          style={inputStyle}
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="+255 712 000 000"
        />
      </div>
    </div>
  );
}

// ── Step 1 ────────────────────────────────────────────────────────────────
function Step1({ form, toggleAmenity }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ fontSize: 13, color: '#5F5E5A' }}>
        Select all amenities available. More amenities = more tenant inquiries.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {AMENITY_OPTIONS.map(a => {
          const selected = form.amenities.includes(a);
          return (
            <button key={a} onClick={() => toggleAmenity(a)} style={{
              padding: '7px 13px', borderRadius: 99, fontSize: 12.5, cursor: 'pointer',
              border: `1px solid ${selected ? '#85B7EB' : '#D3D1C7'}`,
              background: selected ? '#E6F1FB' : '#fff',
              color: selected ? '#185FA5' : '#5F5E5A',
              fontWeight: selected ? 600 : 400,
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}>
              {selected ? '✓ ' : ''}{a}
            </button>
          );
        })}
      </div>
      {form.amenities.length > 0 && (
        <div style={{ padding: '10px 14px', background: '#EAF3DE', borderRadius: 10, fontSize: 12.5, color: '#3B6D11' }}>
          ✓ {form.amenities.length} selected: {form.amenities.join(', ')}
        </div>
      )}
    </div>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────
function Step2({ form, dragging, setDragging, fileInputRef, handleFiles, setCover, removePhoto, setPreview, videoUrl, setVideoUrl, addVideo, removeVideo, getVideoSource }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Drop zone */}
      <div>
        <label style={labelStyle}>Property photos (up to 10)</label>
        <div
          style={{
            border: `2px dashed ${dragging ? '#185FA5' : '#D3D1C7'}`,
            borderRadius: 12, padding: '28px 16px', textAlign: 'center',
            background: dragging ? '#E6F1FB' : '#F8F8F7', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current.click()}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 4 }}>Drag & drop photos here</p>
          <p style={{ fontSize: 12, color: '#888780', marginBottom: 14 }}>or click to browse your device</p>
          <button
            onClick={e => { e.stopPropagation(); fileInputRef.current.click(); }}
            style={{ padding: '8px 18px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            📁 Choose Photos
          </button>
          <p style={{ fontSize: 11, color: '#888780', marginTop: 8 }}>JPG, PNG, WEBP · Max 10MB each</p>
          <input
            type="file" ref={fileInputRef} multiple accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {form.photos.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px,1fr))', gap: 8 }}>
              {form.photos.map((p, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', border: '1px solid #D3D1C7' }}>
                  <img src={p.src} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {i === 0 && (
                    <span style={{ position: 'absolute', bottom: 4, left: 4, background: '#185FA5', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99 }}>COVER</span>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button onClick={() => setPreview(p)} style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: 12 }}>👁</button>
                    <button onClick={() => setCover(i)} style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: 12 }}>⭐</button>
                    <button onClick={() => removePhoto(i)} style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: 12 }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: '#888780', marginTop: 6 }}>{form.photos.length}/10 photos · ⭐ set cover · 👁 preview · 🗑 remove</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: '#D3D1C7' }} />
        <span style={{ fontSize: 12, color: '#888780' }}>+ add video tour</span>
        <div style={{ flex: 1, height: 1, background: '#D3D1C7' }} />
      </div>

      {/* Video */}
      <div>
        <label style={labelStyle}>Video tour links (YouTube, TikTok, Google Drive)</label>
        <div style={{ padding: '10px 14px', background: '#E6F1FB', borderRadius: 10, fontSize: 12.5, color: '#0C447C', marginBottom: 10 }}>
          🎥 Paste a YouTube, TikTok, or Google Drive link of your property walkthrough.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
          <button onClick={addVideo} style={{ padding: '9px 16px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
            + Add
          </button>
        </div>
        {form.videos.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.videos.map((url, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: '1px solid #D3D1C7', background: '#FAEEDA' }}>
                <span style={{ fontSize: 18 }}>🎬</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#854F0B' }}>{getVideoSource(url)}</p>
                  <p style={{ fontSize: 11, color: '#5F5E5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</p>
                </div>
                <button onClick={() => removeVideo(i)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #D3D1C7', background: '#fff', cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '10px 14px', background: '#EAF3DE', borderRadius: 10, fontSize: 12.5, color: '#3B6D11' }}>
        ✓ Properties with photos get 3× more tenant inquiries. The first photo will be the cover image.
      </div>
    </div>
  );
}

// ── Step 3 ────────────────────────────────────────────────────────────────
function Step3({ form }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#F8F8F7', borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#2C2C2A', marginBottom: 12 }}>📋 Listing Summary</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
          {[
            ['Property name', form.name || '—'],
            ['Type',          form.type],
            ['Location',      form.location || '—'],
            ['Monthly rent',  form.price ? `TZS ${Number(form.price).toLocaleString()}` : '—'],
            ['Deposit',       form.deposit ? `TZS ${Number(form.deposit).toLocaleString()}` : '—'],
            ['Bedrooms',      form.beds],
            ['Bathrooms',     form.baths],
            ['Status',        form.status],
            ['Contact',       form.phone || '—'],
            ['Amenities',     form.amenities.length ? `${form.amenities.length} selected` : 'None'],
          ].map(([k, v]) => (
            <div key={k}>
              <p style={{ fontSize: 11, color: '#888780' }}>{k}</p>
              <p style={{ fontSize: 13, color: k === 'Monthly rent' ? '#185FA5' : '#2C2C2A', fontWeight: k === 'Monthly rent' ? 700 : 400 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #D3D1C7', marginTop: 12, paddingTop: 12, display: 'flex', gap: 20 }}>
          <div><p style={{ fontSize: 11, color: '#888780' }}>Photos</p><p style={{ fontSize: 13 }}>{form.photos.length} uploaded</p></div>
          <div><p style={{ fontSize: 11, color: '#888780' }}>Videos</p><p style={{ fontSize: 13 }}>{form.videos.length} linked</p></div>
        </div>
      </div>

      {form.photos.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#5F5E5A', marginBottom: 6 }}>Cover photo preview</p>
          <img src={form.photos[0].src} alt="cover" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid #D3D1C7' }} />
        </div>
      )}

      <div style={{ padding: '12px 14px', background: '#EAF3DE', borderRadius: 10, fontSize: 13, color: '#3B6D11', fontWeight: 500 }}>
        ✓ Everything looks good! Click "Submit Listing" to publish your property.
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function ListPropertyModal({ open, onClose, onSubmit }) {
  const [step, setStep]            = useState(0);
  const [form, setForm]            = useState(emptyForm);
  const [videoUrl, setVideoUrl]    = useState('');
  const [dragging, setDragging]    = useState(false);
  const [previewPhoto, setPreview] = useState(null);
  const fileInputRef               = useRef(null);

  const set = (key, val) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleClose = () => {
    setStep(0); setForm(emptyForm); setVideoUrl(''); onClose();
  };

  const validate = () => {
    if (step === 0) {
      if (!form.name.trim())     { alert('Please enter the property name.');      return false; }
      if (!form.location.trim()) { alert('Please enter the property location.');   return false; }
      if (!form.price)           { alert('Please enter the monthly rent amount.');  return false; }
    }
    return true;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 3)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const toggleAmenity = a =>
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a],
    }));

  const handleFiles = files => {
    const remaining = 10 - form.photos.length;
    Array.from(files).slice(0, remaining).forEach(f => {
      if (!f.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e =>
        setForm(prev => ({ ...prev, photos: [...prev.photos, { src: e.target.result, name: f.name }] }));
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = i =>
    setForm(f => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));

  const setCover = i =>
    setForm(f => {
      const copy = [...f.photos];
      const [item] = copy.splice(i, 1);
      return { ...f, photos: [item, ...copy] };
    });

  const addVideo = () => {
    const url = videoUrl.trim();
    if (!url)                       { alert('Please paste a video URL.');          return; }
    if (!url.startsWith('http'))    { alert('URL must start with http or https.'); return; }
    if (form.videos.includes(url))  { alert('This link is already added.');        return; }
    setForm(f => ({ ...f, videos: [...f.videos, url] }));
    setVideoUrl('');
  };

  const removeVideo = i =>
    setForm(f => ({ ...f, videos: f.videos.filter((_, idx) => idx !== i) }));

  const getVideoSource = url => {
    if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('tiktok'))        return 'TikTok';
    if (url.includes('drive.google')) return 'Google Drive';
    if (url.includes('vimeo'))         return 'Vimeo';
    return 'Video link';
  };

  const handleSubmit = () => {
    onSubmit({ ...form, price: Number(form.price), deposit: Number(form.deposit) });
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏠</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#2C2C2A' }}>List New Property</span>
          </div>
          <button onClick={handleClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #D3D1C7', background: '#fff', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>

        {/* Step tabs */}
        <div style={{ display: 'flex', background: '#F8F8F7', borderBottom: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
          {STEPS.map((s, i) => (
            <div key={i} onClick={() => i < step && setStep(i)} style={{
              flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 11.5,
              cursor: i < step ? 'pointer' : 'default',
              color: i === step ? '#185FA5' : i < step ? '#3B6D11' : '#888780',
              fontWeight: i === step ? 700 : 400,
              borderBottom: `2px solid ${i === step ? '#185FA5' : i < step ? '#3B6D11' : 'transparent'}`,
              background: i === step ? '#fff' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              {i < step && '✓ '}{s}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 20 }}>
          {step === 0 && <Step0 form={form} set={set} />}
          {step === 1 && <Step1 form={form} toggleAmenity={toggleAmenity} />}
          {step === 2 && (
            <Step2
              form={form}
              dragging={dragging} setDragging={setDragging}
              fileInputRef={fileInputRef} handleFiles={handleFiles}
              setCover={setCover} removePhoto={removePhoto}
              setPreview={setPreview}
              videoUrl={videoUrl} setVideoUrl={setVideoUrl}
              addVideo={addVideo} removeVideo={removeVideo}
              getVideoSource={getVideoSource}
            />
          )}
          {step === 3 && <Step3 form={form} />}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F8F7', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#888780' }}>Step {step + 1} of {STEPS.length}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button onClick={prev} style={{ padding: '8px 16px', border: '1px solid #D3D1C7', background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ← Back
              </button>
            )}
            {step < 3 && (
              <button onClick={next} style={{ padding: '8px 20px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Next →
              </button>
            )}
            {step === 3 && (
              <button onClick={handleSubmit} style={{ padding: '8px 20px', background: '#3B6D11', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                ✓ Submit Listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Photo preview overlay */}
      {previewPhoto && (
        <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={previewPhoto.src} alt="preview" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} />
          <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
      )}
    </div>
  );
}