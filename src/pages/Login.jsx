import React, { useState } from 'react';

export default function Login({ onLogin, onGoRegister }) {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = () => {
    setError('');
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.'); return;
    }
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('rentbot_users') || '[]');
      const user  = users.find(u => u.email === form.email && u.password === form.password);
      if (!user) {
        setError('Incorrect email or password.'); setLoading(false); return;
      }
      localStorage.setItem('rentbot_session', JSON.stringify(user));
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🏠</div>
          <span style={styles.logoText}>RentBot</span>
        </div>

        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Sign in to manage your properties</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={form.password}
            onChange={e => set('password', e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={onGoRegister}>Create one</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: 'linear-gradient(135deg, #E6F1FB 0%, #F8F8F7 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '36px 32px',
    width: '100%', maxWidth: 420,
    boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  logoIcon: { width: 36, height: 36, background: '#185FA5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  logoText: { fontSize: 22, fontWeight: 700, color: '#2C2C2A' },
  title: { fontSize: 22, fontWeight: 700, color: '#2C2C2A', margin: 0 },
  sub:   { fontSize: 13.5, color: '#888780', margin: 0 },
  error: { background: '#FCEBEB', border: '1px solid #F09595', color: '#A32D2D', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: '#5F5E5A' },
  input: {
    padding: '10px 12px', border: '1px solid #D3D1C7', borderRadius: 8,
    fontSize: 13.5, color: '#2C2C2A', background: '#fff',
    outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  },
  btn: {
    padding: '11px', background: '#185FA5', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', marginTop: 4,
  },
  switchText: { fontSize: 13, color: '#888780', textAlign: 'center', margin: 0 },
  link: { color: '#185FA5', fontWeight: 600, cursor: 'pointer' },
};