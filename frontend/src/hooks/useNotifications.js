import { useState, useEffect, useRef } from 'react'

const API_URL = 'http://localhost:3000'

export function useNotifications(user) {
  const [unreadCount, setUnreadCount] = useState(0)
  const lastSeenRef = useRef(0)
  const pollRef = useRef(null)

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      
      const osc1 = ctx.createOscillator()
      const g1 = ctx.createGain()
      osc1.connect(g1)
      g1.connect(ctx.destination)
      osc1.type = 'sine'
      osc1.frequency.value = 880
      g1.gain.setValueAtTime(0.15, now)
      g1.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc1.start(now)
      osc1.stop(now + 0.2)
      
      const osc2 = ctx.createOscillator()
      const g2 = ctx.createGain()
      osc2.connect(g2)
      g2.connect(ctx.destination)
      osc2.type = 'sine'
      osc2.frequency.value = 1200
      g2.gain.setValueAtTime(0.001, now + 0.2)
      g2.gain.exponentialRampToValueAtTime(0.15, now + 0.25)
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
      osc2.start(now + 0.2)
      osc2.stop(now + 0.5)
    } catch (e) {
      console.warn('Ses çalınamadı:', e)
    }
  }

  const showToast = (message) => {
    // Basit toast - sağ üstte
    const el = document.createElement('div')
    el.textContent = message
    el.style.cssText = `
      position: fixed; top: 80px; right: 20px;
      background: #2c3e50; color: #fff;
      padding: 14px 20px; border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,.3);
      z-index: 99999; font-size: 14px; font-weight: 600;
      max-width: 280px;
      animation: scaleIn 0.3s ease-out;
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }

  const checkMessages = async () => {
    if (!user) return

    try {
      const res = await fetch(`${API_URL}/api/messages/user/${user.id}`)
      const list = await res.json()
      if (!Array.isArray(list)) return

      const unread = list.filter(m => m.toId === user.id && !m.read).length
      setUnreadCount(unread)

      // Yeni mesaj kontrolü
      if (lastSeenRef.current > 0) {
        list.forEach(m => {
          if (m.id > lastSeenRef.current && m.toId === user.id) {
            showToast(`💬 ${m.fromName}: ${m.text.substring(0, 40)}`)
            playSound()
          }
        })
      }

      if (list.length > 0) {
        const maxId = Math.max(...list.map(m => m.id))
        lastSeenRef.current = maxId
      }
    } catch (err) {
      console.warn('Mesaj kontrolü hatası:', err)
    }
  }

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }

    checkMessages()
    pollRef.current = setInterval(checkMessages, 10000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [user])

  return { unreadCount }
}
