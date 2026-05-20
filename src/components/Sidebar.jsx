import React from 'react';
import {
  LayoutDashboard, Home, MapPin, Users, CreditCard,
  MessageSquare, LogOut, Building2
} from 'lucide-react';

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',      icon: LayoutDashboard, section: 'Main'       },
  { key: 'properties', label: 'My Properties',  icon: Home,            section: null         },
  { key: 'locations',  label: 'Locations',      icon: MapPin,          section: null         },
  { key: 'tenants',    label: 'Tenants',         icon: Users,           section: 'Management' },
  { key: 'payments',   label: 'Payments',        icon: CreditCard,      section: null         },
  { key: 'messages',   label: 'Messages',        icon: MessageSquare,   section: null         },
];

export default function Sidebar({ active, setActive, unreadCount, user, onLogout }) {
  let lastSection = null;

  return (
    <aside style={{
      width: 224, flexShrink: 0, background: '#fff',
      borderRight: '1px solid rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={17} color="#fff" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#2C2C2A' }}>RentBot</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const Icon     = item.icon;
          const isActive = active === item.key;
          return (
            <React.Fragment key={item.key}>
              {showSection && (
                <div style={{ padding: '14px 20px 4px', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', color: '#888780', textTransform: 'uppercase' }}>
                  {item.section}
                </div>
              )}
              <div
                onClick={() => setActive(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 20px', fontSize: 13.5, cursor: 'pointer',
                  color: isActive ? '#185FA5' : '#5F5E5A',
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? '#E6F1FB' : 'transparent',
                  borderLeft: `2px solid ${isActive ? '#185FA5' : 'transparent'}`,
                  transition: 'all 0.15s', userSelect: 'none', position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8F8F7'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={15} />
                {item.label}
                {item.key === 'messages' && unreadCount > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#185FA5', color: '#fff', borderRadius: 99, fontSize: 10, fontWeight: 600, padding: '1px 6px' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Profile + logout */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'LL'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#2C2C2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Landlord'}
          </div>
          <div style={{ fontSize: 11.5, color: '#888780', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || ''}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sign out"
          style={{ background: 'none', border: '1px solid #D3D1C7', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', color: '#888780', display: 'flex', alignItems: 'center' }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}