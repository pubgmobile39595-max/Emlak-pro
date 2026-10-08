import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3000'

function MessagesModal({ user, onClose }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    if (!user) return
    try {
      const res = await fetch(`${API_URL}/api/messages/user/${user.id}`)
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    } catch (err) {
      console.error('Mesajlar yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [user])

  // Sohbetleri grupla (karşı taraf bazlı)
  const chats = {}
  messages.forEach(m => {
    const otherId = m.fromId === user.id ? m.toId : m.fromId
    const otherName = m.fromId === user.id ? m.toName : m.fromName
    if (!chats[otherId]) {
      chats[otherId] = { otherId, otherName, messages: [], unread: 0 }
    }
    chats[otherId].messages.push(m)
    if (m.toId === user.id && !m.read) chats[otherId].unread++
  })

  const chatList = Object.values(chats).sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]
    const bLast = b.messages[b.messages.length - 1]
    return (bLast?.id || 0) - (aLast?.id || 0)
  })

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2>💬 Mesajlarım</h2>
          
          {loading ? (
            <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '30px' }}>
              ⏳ Yükleniyor...
            </p>
          ) : chatList.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '30px' }}>
              Henüz mesajın yok.
            </p>
          ) : (
            <div className="chat-list">
              {chatList.map(chat => (
                <div key={chat.otherId} className="chat-item">
                  <div className="chat-avatar">
                    {chat.otherName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="chat-info">
                    <h4>{chat.otherName}</h4>
                    <p>
                      {chat.messages[chat.messages.length - 1]?.text?.substring(0, 40)}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="chat-badge">{chat.unread}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>Kapat</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesModal
