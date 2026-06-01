import React, { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Topbar, Badge } from '../components/UI';
import { apiGetMessages, apiMarkMessageRead, apiDeleteMessage } from '../api';

export default function Messages() {
  const [messages, setMessages]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [reply, setReply]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [replies, setReplies]     = useState({});

  useEffect(() => {
    apiGetMessages()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setMessages(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectMsg = async (m) => {
    setSelected(m);
    if (m.status === 'unread') {
      try {
        await apiMarkMessageRead(m._id);
        setMessages(prev => prev.map(msg => msg._id === m._id ? { ...msg, status: 'read' } : msg));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await apiDeleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      alert('Failed to delete message.');
    }
  };

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    setReplies(prev => ({
      ...prev,
      [selected._id]: [...(prev[selected._id] || []), { text: reply, time: 'Just now', mine: true }],
    }));
    setReply('');
  };

  const unread = messages.filter(m => m.status === 'unread').length;

  return (
    <>
      <Topbar title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Messages
          {unread > 0 && <Badge variant="blue">{unread} new</Badge>}
        </span>
      } />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Inbox */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border)', overflowY: 'auto', background: '#fff' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Inbox — {messages.length} messages
          </div>
          {loading ? (
            <p style={{ padding: 20, fontSize: 13, color: 'var(--gray-400)', textAlign: 'center' }}>Loading...</p>
          ) : messages.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>No messages yet.</p>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>Messages from tenants will appear here.</p>
            </div>
          ) : (
            messages.map(m => (
              <div key={m._id} onClick={() => selectMsg(m)} style={{
                padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                background: selected?._id === m._id ? 'var(--blue-light)' : m.status === 'unread' ? '#FAFBFF' : '#fff',
                borderLeft: `3px solid ${selected?._id === m._id ? 'var(--blue)' : 'transparent'}`,
              }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: selected?._id === m._id ? 'var(--blue)' : 'var(--gray-200)', color: selected?._id === m._id ? '#fff' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    {(m.senderName || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: m.status === 'unread' ? 700 : 500, color: 'var(--gray-800)' }}>{m.senderName || 'Unknown'}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--gray-400)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--blue)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.property?.propertyName || ''}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--gray-50)' }}>
          {selected ? (
            <>
              {/* Chat header */}
              <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
                    {(selected.senderName || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{selected.senderName || 'Unknown'}</p>
                    <p style={{ fontSize: 12, color: 'var(--blue)' }}>
                      {selected.email || ''} {selected.property?.propertyName ? `· Re: ${selected.property.propertyName}` : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(selected._id)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #D3D1C7', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={14} color="var(--red)" />
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Original message */}
                <div style={{ display: 'flex', gap: 10, maxWidth: '75%' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                    {(selected.senderName || 'T').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: 13.5, lineHeight: 1.6 }}>
                      {selected.message}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Replies */}
                {(replies[selected._id] || []).map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, maxWidth: '75%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                      Me
                    </div>
                    <div>
                      <div style={{ background: 'var(--blue)', color: '#fff', padding: '10px 14px', borderRadius: '12px 0 12px 12px', fontSize: 13.5, lineHeight: 1.6 }}>
                        {msg.text}
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4, textAlign: 'right' }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()}
                  placeholder={`Reply to ${selected.senderName || 'tenant'}...`}
                  style={{ flex: 1, padding: '9px 14px', border: '1px solid #D3D1C7', borderRadius: 'var(--r-md)', fontSize: 13.5, background: 'var(--gray-50)', outline: 'none', fontFamily: 'inherit' }}
                />
                <button onClick={sendReply} style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--blue)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--gray-400)' }}>
              <span style={{ fontSize: 36 }}>💬</span>
              <p style={{ fontSize: 14 }}>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}