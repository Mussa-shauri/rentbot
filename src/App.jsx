import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Toast } from './components/UI';
import { apiGetProperties, apiGetMessages } from './api';

import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants    from './pages/Tenants';
import Payments   from './pages/Payments';
import Messages   from './pages/Messages';
import Locations  from './pages/Locations';

export default function App() {
  const [user, setUser]             = useState(null);
  const [authPage, setAuthPage]     = useState('login');
  const [activePage, setActivePage] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState({ visible: false, message: '', type: 'success' });

  // Check session on load
  useEffect(() => {
    const session = localStorage.getItem('rentbot_session');
    if (session) setUser(JSON.parse(session));
  }, []);

  // Fetch properties and unread message count when user logs in
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    apiGetProperties()
      .then(data => setProperties(data))
      .catch(() => showToast('Could not load properties.', 'error'))
      .finally(() => setLoading(false));

    // Fetch real unread message count
    apiGetMessages()
      .then(data => {
        const count = Array.isArray(data)
          ? data.filter(m => m.status === 'unread').length
          : 0;
        setUnreadCount(count);
      })
      .catch(() => setUnreadCount(0));
  }, [user]);

  // Update unread count when user visits messages page
  useEffect(() => {
    if (activePage === 'messages' && user) {
      apiGetMessages()
        .then(data => {
          const count = Array.isArray(data)
            ? data.filter(m => m.status === 'unread').length
            : 0;
          setUnreadCount(count);
        })
        .catch(() => {});
    }
  }, [activePage]);

  const handleLogin = (u) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem('rentbot_session');
    localStorage.removeItem('rentbot_token');
    setUser(null);
    setProperties([]);
    setUnreadCount(0);
    setAuthPage('login');
    setActivePage('dashboard');
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  if (!user) {
    return authPage === 'login'
      ? <Login    onLogin={handleLogin} onGoRegister={() => setAuthPage('register')} />
      : <Register onGoLogin={() => setAuthPage('login')} />;
  }

  const pageProps = { properties, setProperties, showToast, setActivePage, user };

  const renderPage = () => {
    if (loading) return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 36 }}>🏠</div>
        <p style={{ fontSize: 14, color: '#888' }}>Loading your properties...</p>
      </div>
    );
    switch (activePage) {
      case 'dashboard':  return <Dashboard  {...pageProps} />;
      case 'properties': return <Properties {...pageProps} />;
      case 'tenants':    return <Tenants    {...pageProps} />;
      case 'payments':   return <Payments   {...pageProps} />;
      case 'messages':   return <Messages   {...pageProps} />;
      case 'locations':  return <Locations  {...pageProps} />;
      default:           return <Dashboard  {...pageProps} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F1EFE8' }}>
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        unreadCount={unreadCount}
        user={user}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderPage()}
      </div>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}