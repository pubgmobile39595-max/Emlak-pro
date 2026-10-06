const CACHE_NAME = 'emlakpro-v1';
const CACHE_FILES = [
  '/emlak_v2_2026.html',
  '/index.html',
  '/harita.html',
  '/manifest.json'
];

// Kurulum
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(CACHE_FILES).catch(function(e){ console.log('Cache hatası:', e); });
    })
  );
  self.skipWaiting();
});

// Aktivasyon - eski önbellekleri temizle
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.map(function(name){
          if(name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - önbellekten veya ağdan
self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;
  if(event.request.url.indexOf('/api/') > -1) return;

  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response) return response;
      return fetch(event.request).then(function(res){
        if(!res || res.status !== 200 || res.type !== 'basic') return res;
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, clone);
        });
        return res;
      }).catch(function(){
        return caches.match('/emlak_v2_2026.html');
      });
    })
  );
});
