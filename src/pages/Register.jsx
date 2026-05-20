import React, { useState } from 'react';

export default function Register({ onGoLogin }) {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = () => {
    setError('');
    if (!form.name.trim())                        { setError('Please enter your full name.');        return; }
    if (!form.email.trim())                       { setError('Please enter your email.');            return; }
    if (!form.email.includes('@'))                { setError('Please enter a valid email address.'); return; }
    if (!form.phone.trim())                       { setError('Please enter your phone number.');     return; }
    if (form.password.length < 6)                 { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm)           { setError('Passwords do not match.');             return; }

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('rentbot_users') || '[]');
      if (users.find(u => u.email === form.email)) {
        setError('An account with this email already exists.'); setLoading(false); return;
      }
      const newUser = { name: form.name, email: form.email, phone: form.phone, password: form.password };
      users.push(newUser);
      localStorage.setItem('rentbot_users', JSON.stringify(users));
      setSuccess(true);
      setLoading(false);
    }, 800);
  };

  if (success) return (
    <div style={styles.page}>
      <div style={{ ...styles.card, textAlign: 'center', gap: 16 }}>
        <div style={{ fontSize: 52 }}>🎉</div>
        <h2 style={styles.title}>Account created!</h2>
        <p style={{ fontSize: 13.5, color: '#5F5E5A' }}>
          Your landlord account has been created successfully. You can now sign in.
        </p>
        <button onClick={onGoLogin} style={styles.btn}>Go to Sign in</button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🏠</div>
          <span style={styles.logoText}>RentBot</span>
        </div>

        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.sub}>Register as a landlord to list your properties</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Full name</label>
          <input
            style={styles.input} value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. James Mwangi"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input} type="email" value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone number</label>
          <input
            style={styles.input} value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="+255 712 000 000"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input} type="password" value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="Min. 6 characters"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input
              style={styles.input} type="password" value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <span style={styles.link} onClick={onGoLogin}>Sign in</span>
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
    width: '100%', maxWidth: 440,
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