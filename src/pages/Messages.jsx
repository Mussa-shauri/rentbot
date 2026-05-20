import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { PageWrapper, Topbar, Badge } from '../components/UI';
import { MESSAGES } from '../data/data';

export default function Messages() {
  const [messages, setMessages]   = useState(MESSAGES.map(m => ({ ...m })));
  const [selected, setSelected]   = useState(messages[0]);
  const [reply, setReply]         = useState('');
  const [threads, setThreads]     = useState({});

  const unread = messages.filter(m => m.unread).length;

  const selectMsg = (m) => {
    setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, unread: false } : msg));
    setSelected({ ...m, unread: false });
  };

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    setThreads(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { from: 'You (James)', text: reply, time: 'Just now', mine: true }],
    }));
    setReply('');
  };

  return (
    <>
      <Topbar title={<span>Messages {unread > 0 && <Badge variant="blue">{unread} new</Badge>}</span>} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', margin: '0' }}>

        {/* Inbox list */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border)', overflowY: 'auto', background: '#fff' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Inbox — {messages.length} inquiries
          </div>
          {messages.map(m => (
            <div key={m.id} onClick={() => selectMsg(m)} style={{
              padding: '14px 16px', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', background: selected?.id === m.id ? 'var(--blue-light)' : m.unread ? '#FAFBFF' : '#fff',
              borderLeft: `3px solid ${selected?.id === m.id ? 'var(--blue)' : 'transparent'}`,
              transition: 'background 0.12s',
            }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: selected?.id === m.id ? 'var(--blue)' : 'var(--gray-200)', color: selected?.id === m.id ? '#fff' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{m.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: m.unread ? 700 : 500, color: 'var(--gray-800)' }}>{m.from}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--gray-400)' }}>{m.time}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</p>
                  <p style={{ fontSize: 11, color: 'var(--blue)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.property}</p>
                </div>
              </div>
              {m.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', position: 'absolute', right: 14, marginTop: -30 }} />}
            </div>
          ))}
        </div>

        {/* Chat panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--gray-50)' }}>
          {selected ? (
            <>
              {/* Chat header */}
              <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{selected.avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{selected.from}</p>
                  <p style={{ fontSize: 12, color: 'var(--blue)' }}>Re: {selected.property}</p>
                </div>
              </div>

              {/* Messages area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Original message */}
                <div style={{ display: 'flex', gap: 10, maxWidth: '75%' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{selected.avatar}</div>
                  <div>
                    <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: 13.5, color: 'var(--gray-800)', lineHeight: 1.6 }}>{selected.text}</div>
                    <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>{selected.time}</p>
                  </div>
                </div>

                {/* Thread replies */}
                {(threads[selected.id] || []).map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, maxWidth: '75%', alignSelf: msg.mine ? 'flex-end' : 'flex-start', flexDirection: msg.mine ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: msg.mine ? 'var(--blue)' : 'var(--gray-200)', color: msg.mine ? '#fff' : 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                      {msg.mine ? 'JM' : selected.avatar}
                    </div>
                    <div>
                      <div style={{ background: msg.mine ? 'var(--blue)' : '#fff', color: msg.mine ? '#fff' : 'var(--gray-800)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: msg.mine ? '12px 0 12px 12px' : '0 12px 12px 12px', fontSize: 13.5, lineHeight: 1.6 }}>{msg.text}</div>
                      <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4, textAlign: msg.mine ? 'right' : 'left' }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <input
                  value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()}
                  placeholder={`Reply to ${selected.from}...`}
                  style={{ flex: 1, padding: '9px 14px', border: '1px solid var(--border-med)', borderRadius: 'var(--r-md)', fontSize: 13.5, background: 'var(--gray-50)', outline: 'none' }}
                />
                <button onClick={sendReply} style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--blue)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} color="#fff" />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 36 }}>💬</span>
              <p style={{ fontSize: 14 }}>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
