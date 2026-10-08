import { useState } from 'react'

const API_URL = 'http://localhost:3000'

function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    
    if (!username || !password) {
      setError('⚠️ Kullanıcı adı ve şifre zorunlu')
      return
    }
    if (password.length < 4) {
      setError('⚠️ Şifre en az 4 karakter olmalı')
      return
    }

    setLoading(true)
    try {
      const url = mode === 'login' ? '/api/login' : '/api/register'
      const res = await fetch(API_URL + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError('❌ ' + (data.error || 'Hata'))
        setLoading(false)
        return
      }
      
      localStorage.setItem('emlak_user', JSON.stringify(data))
      if (data.token) localStorage.setItem('emlak_token', data.token)
      
      onSuccess(data)
    } catch (err) {
      setError('❌ Bağlantı hatası')
      setLoading(false)
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
          
          <div className="auth-tabs">
            <button 
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Giriş
            </button>
            <button 
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              Kayıt Ol
            </button>
          </div>
          
          <div className="form-grid">
            <div>
              <label>Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div className="modal-actions">
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '⏳...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
            </button>
            <button className="btn-secondary" onClick={onClose}>İptal</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
