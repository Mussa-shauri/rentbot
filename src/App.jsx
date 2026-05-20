import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Toast } from './components/UI';
import { INITIAL_PROPERTIES, MESSAGES } from './data/data';

import Login    from './pages/Login';
import Register from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants    from './pages/Tenants';
import Payments   from './pages/Payments';
import Messages   from './pages/Messages';
import Locations  from './pages/Locations';

export default function App() {
  const [user, setUser]           = useState(null);
  const [authPage, setAuthPage]   = useState('login'); // 'login' | 'register'
  const [activePage, setActivePage] = useState('dashboard');
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [toast, setToast]           = useState({ visible: false, message: '', type: 'success' });

  // Check if already logged in
  useEffect(() => {
    const session = localStorage.getItem('rentbot_session');
    if (session) setUser(JSON.parse(session));
  }, []);

  const handleLogin = (u) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem('rentbot_session');
    setUser(null);
    setAuthPage('login');
    setActivePage('dashboard');
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  // ── Not logged in ──────────────────────────────────────────────────────
  if (!user) {
    return authPage === 'login'
      ? <Login    onLogin={handleLogin}  onGoRegister={() => setAuthPage('register')} />
      : <Register onGoLogin={() => setAuthPage('login')} />;
  }

  // ── Logged in ──────────────────────────────────────────────────────────
  const unreadCount = MESSAGES.filter(m => m.unread).length;
  const pageProps   = { properties, setProperties, showToast, setActivePage };

  const renderPage = () => {
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