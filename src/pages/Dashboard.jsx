import React, { useEffect, useState } from 'react';
import { Home, Users, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { PageWrapper, Topbar } from '../components/UI';
import { apiGetMessages } from '../api';

export default function Dashboard({ properties, setActivePage, user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    apiGetMessages()
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const total     = properties.length;
  const available = properties.filter(p => p.status === 'available').length;
  const occupied  = properties.filter(p => p.status === 'occupied').length;
  const pending   = properties.filter(p => p.status === 'pending').length;
  const revenue   = properties
    .filter(p => p.status === 'occupied')
    .reduce((a, b) => a + Number(b.price), 0);

  const recentProperties = [...properties].slice(0, 3);
  const unread = messages.filter(m => m.status === 'unread').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  const card = (icon, label, value, sub, subColor, bg, onClick) => (
    <div
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '18px 20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 500 }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--gray-800)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11.5, color: subColor || 'var(--gray-400)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );

  const statusDot = s => {
    const colors = { available: 'var(--green)', occupied: 'var(--red)', pending: 'var(--amber)' };
    return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[s] || 'var(--gray-400)', display: 'inline-block', marginRight: 6 }} />;
  };

  return (
    <>
      <Topbar title="Dashboard" />
      <PageWrapper>

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(120deg, var(--blue) 0%, var(--blue-dark) 100%)',
          borderRadius: 'var(--r-lg)', padding: '22px 24px',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>{getGreeting()}</p>
            <h1 style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 6 }}>
              {user?.name || 'Landlord'}
            </h1>
            <p style={{ fontSize: 13, opacity: 0.75 }}>
              You have {unread} unread message{unread !== 1 ? 's' : ''} and {available} available propert{available !== 1 ? 'ies' : 'y'}.
            </p>
          </div>
          <div style={{ fontSize: 52, opacity: 0.25 }}>🏢</div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {card(<Home size={16} color="var(--blue)" />, 'Total properties', total, 'Listed on platform', null, 'var(--blue-light)', () => setActivePage('properties'))}
          {card(<CheckCircle size={16} color="var(--green)" />, 'Available', available, 'Ready for tenants', 'var(--green)', 'var(--green-light)', () => setActivePage('properties'))}
          {card(<Users size={16} color="var(--red)" />, 'Occupied', occupied, `${pending} pending review`, 'var(--amber)', 'var(--red-light)', () => setActivePage('tenants'))}
          {card(<TrendingUp size={16} color="var(--amber)" />, 'Monthly revenue', revenue >= 1000000 ? `TZS ${(revenue / 1000000).toFixed(1)}M` : `TZS ${revenue.toLocaleString()}`, 'From occupied units', 'var(--green)', 'var(--amber-light)', () => setActivePage('payments'))}
        </div>

        {/* Recent properties + messages */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Recent Properties */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-display)' }}>Recent Properties</span>
              <span onClick={() => setActivePage('properties')} style={{ fontSize: 12, color: 'var(--blue)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
            </div>
            {recentProperties.length === 0 ? (
              <div style={{ padding: '24px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🏠</div>
                <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>No properties yet.</p>
              </div>
            ) : (
              recentProperties.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: ['#E6F1FB','#E1F5EE','#FAEEDA','#FBEAF0'][p.color % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {['🏢','🏠','🏡','🏗️'][p.color % 4]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>{p.location}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--blue)' }}>TZS {Number(p.price).toLocaleString()}</p>
                    <span>{statusDot(p.status)}<span style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'capitalize' }}>{p.status}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Messages from MongoDB */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-display)' }}>Recent Inquiries</span>
              <span onClick={() => setActivePage('messages')} style={{ fontSize: 12, color: 'var(--blue)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
            </div>
            {messages.length === 0 ? (
              <div style={{ padding: '24px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>No inquiries yet.</p>
                <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>Messages from tenants will appear here.</p>
              </div>
            ) : (
              messages.slice(0, 3).map(m => (
                <div key={m._id} style={{ display: 'flex', gap: 10, padding: '12px 18px', borderBottom: '1px solid var(--border)', background: m.status === 'unread' ? 'var(--blue-light)' : '#fff' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    {(m.senderName || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: m.status === 'unread' ? 600 : 400, color: 'var(--gray-800)' }}>{m.senderName || 'Unknown'}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--blue)', marginTop: 2 }}>{m.property?.propertyName || ''}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment summary */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-display)' }}>Payment Overview</span>
            <span onClick={() => setActivePage('payments')} style={{ fontSize: 12, color: 'var(--blue)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
            {[
              { label: 'Paid this month', value: 'TZS 0', icon: <CheckCircle size={15} color="var(--green)" />, color: 'var(--green)' },
              { label: 'Upcoming',        value: 'TZS 0', icon: <Clock size={15} color="var(--amber)" />,       color: 'var(--amber)' },
              { label: 'Overdue',         value: 'TZS 0', icon: <AlertCircle size={15} color="var(--red)" />,   color: 'var(--red)'   },
            ].map((item, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  {item.icon}
                  <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{item.label}</span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: item.color, fontFamily: 'var(--font-display)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

      </PageWrapper>
    </>
  );
}