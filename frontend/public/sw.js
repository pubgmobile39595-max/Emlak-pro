const CACHE_NAME = 'emlakpro-v1'
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
]

// Kurulum
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES).catch((e) => console.log('Cache hatası:', e))
    })
  )
  self.skipWaiting()
})

// Aktivasyon - eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name)
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (event.request.url.indexOf('/api/') > -1) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res
        const clone = res.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone)
        })
        return res
      }).catch(() => {
        return caches.match('/index.html')
      })
    })
  )
})
