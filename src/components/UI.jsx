import React, { useEffect } from 'react';

export function Button({ children, variant = 'primary', size = 'md', onClick, style, disabled, type = 'button' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-body)', fontWeight: 500,
    borderRadius: 'var(--r-md)', transition: 'all 0.15s',
    opacity: disabled ? 0.55 : 1,
  };
  const sizes = {
    sm: { fontSize: 12, padding: '5px 12px' },
    md: { fontSize: 13, padding: '8px 16px' },
    lg: { fontSize: 14, padding: '10px 22px' },
  };
  const variants = {
    primary: { background: 'var(--blue)', color: '#fff' },
    secondary: { background: 'transparent', color: 'var(--gray-700)', border: '1px solid var(--border-med)' },
    danger: { background: 'var(--red)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--gray-600)', border: 'none' },
    success: { background: 'var(--green)', color: '#fff' },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue: { bg: 'var(--blue-light)', color: 'var(--blue-dark)' },
    green: { bg: 'var(--green-light)', color: 'var(--green)' },
    red: { bg: 'var(--red-light)', color: 'var(--red)' },
    amber: { bg: 'var(--amber-light)', color: 'var(--amber)' },
    gray: { bg: 'var(--gray-100)', color: 'var(--gray-600)' },
  };
  const v = variants[variant] || variants.blue;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 99,
      fontSize: 11, fontWeight: 600,
      background: v.bg, color: v.color,
    }}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    available: { label: 'Available', variant: 'green' },
    occupied: { label: 'Occupied', variant: 'red' },
    pending: { label: 'Pending', variant: 'amber' },
  };
  const s = map[status] || map.available;
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function Modal({ open, onClose, title, children, width = 500 }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 'var(--r-lg)',
        width: '100%', maxWidth: width,
        maxHeight: '92vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)' }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, border: '1px solid var(--border)',
              borderRadius: 8, background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--gray-600)',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

export function Toast({ message, type = 'success', visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
      background: type === 'error' ? 'var(--red)' : 'var(--green)',
      color: '#fff', padding: '10px 18px',
      borderRadius: 'var(--r-md)',
      fontSize: 13, fontWeight: 500,
      boxShadow: 'var(--shadow-md)',
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
    }}>
      {message}
    </div>
  );
}

export function StatCard({ label, value, sub, subColor }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--r-lg)',
      border: '1px solid var(--border)',
      padding: '16px 18px',
    }}>
      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--gray-800)', fontFamily: 'var(--font-display)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: subColor || 'var(--gray-400)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-600)' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 11px',
  border: '1px solid var(--border-med)',
  borderRadius: 'var(--r-sm)',
  fontSize: 13.5, color: 'var(--gray-800)',
  background: '#fff', outline: 'none',
  transition: 'border-color 0.15s',
};

export function Input({ value, onChange, placeholder, type = 'text', style }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder}
      style={{ ...inputStyle, ...style }}
      onFocus={e => e.target.style.borderColor = 'var(--blue)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
    />
  );
}

export function Select({ value, onChange, children, style }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{ ...inputStyle, ...style }}
      onFocus={e => e.target.style.borderColor = 'var(--blue)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
    >
      {children}
    </select>
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3, style }) {
  return (
    <textarea
      value={value} onChange={onChange}
      placeholder={placeholder} rows={rows}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, ...style }}
      onFocus={e => e.target.style.borderColor = 'var(--blue)'}
      onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
    />
  );
}

export function SectionHeader({ title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 14,
    }}>
      <h2 style={{
        fontSize: 15, fontWeight: 600, color: 'var(--gray-800)',
        fontFamily: 'var(--font-display)',
      }}>{title}</h2>
      {action}
    </div>
  );
}

export function PageWrapper({ children }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {children}
    </div>
  );
}

export function Topbar({ title, actions }) {
  return (
    <div style={{
      height: 56, flexShrink: 0,
      background: '#fff', borderBottom: '1px solid var(--border)',
      padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--gray-800)' }}>{title}</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>
    </div>
  );
}