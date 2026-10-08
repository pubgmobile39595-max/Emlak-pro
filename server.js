require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const db = require('./db');
db.initDatabase().then(function(){
  console.log('✅ SQLite bağlantısı hazır');
}).catch(function(err){
  console.error('❌ SQLite hatası:', err.message);
});

const bcrypt = require('bcryptjs');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'listings.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const MSGS_FILE = path.join(__dirname, 'data', 'messages.json');

// data klasörünü oluştur
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(MSGS_FILE)) fs.writeFileSync(MSGS_FILE, '[]');

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch(e) { return []; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const MIME = {
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.gif':'image/gif', '.svg':'image/svg+xml', '.ico':'image/x-icon',
  '.webp':'image/webp'
};
const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};
// ===== JWT DOGRULAMA ===== 
function verifyToken(req){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
  } catch(e) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const url = req.url.split('?')[0];

  // ===== API =====
  if (url.startsWith('/api/')) {
    handleAPI(req, res, url);
    return;
  }

  // ===== STATIC (React dist) =====
  const distDir = path.join(__dirname, 'frontend', 'dist');
  
  let filePath = url === '/' ? '/index.html' : url;
  filePath = path.join(distDir, decodeURIComponent(filePath));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(distDir, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
          res.end('404 - Bulunamadı');
          return;
        }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, Object.assign({ 'Content-Type': MIME[ext] || 'application/octet-stream' }, NO_CACHE_HEADERS));
    res.end(data);
  });
});

function handleAPI(req, res, url) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let payload = {};
    if (body) { try { payload = JSON.parse(body); } catch(e) {} }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // ===== İLANLAR =====
    if (url === '/api/listings' && req.method === 'GET') {
      const rows = db.query("SELECT * FROM listings ORDER BY created_at DESC");
      const list = rows.map(r => ({
        id: r.id,
        title: r.title,
        location: r.location,
        price: r.price,
        type: r.type,
        rooms: r.rooms,
        area: r.area,
        bath: r.bath,
        lat: r.lat,
        lng: r.lng,
        img: r.img,
        images: r.img ? [r.img] : [],
        desc: r.desc,
        phone: r.phone,
        ownerId: r.owner_id,
        ownerName: r.owner_name,
        views: r.views,
        avgRating: r.avg_rating,
        ratingCount: r.rating_count,
        createdAt: r.created_at
      }));
      res.writeHead(200);
      res.end(JSON.stringify(list));
      return;
    }

      const list = readJSON(DATA_FILE);
  const newItem = payload;
  newItem.id = Date.now();
  newItem.createdAt = new Date().toISOString();
  newItem.views = 0;
  // Çoklu resim desteği - images dizisi yoksa oluştur
  if (!newItem.images || !Array.isArray(newItem.images)) {
  newItem.images = newItem.img ? [newItem.img] : [];
}
if (url === '/api/listings' && req.method === 'POST') {
  const id = Date.now();
  const createdAt = new Date().toISOString();
  db.run(
    "INSERT INTO listings (id, title, location, price, type, rooms, area, bath, lat, lng, img, desc, phone, owner_id, owner_name, views, avg_rating, rating_count, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,0,0,?)",
    [id, payload.title, payload.location, payload.price, payload.type, payload.rooms || null, payload.area || null, payload.bath || null, payload.lat || null, payload.lng || null, payload.img || null, payload.desc || null, payload.phone || null, payload.ownerId || null, payload.ownerName || null, createdAt]
  );
  const newItem = {
    id: id,
    title: payload.title,
    location: payload.location,
    price: payload.price,
    type: payload.type,
    rooms: payload.rooms,
    area: payload.area,
    bath: payload.bath,
    lat: payload.lat,
    lng: payload.lng,
    img: payload.img,
    desc: payload.desc,
    phone: payload.phone,
    ownerId: payload.ownerId,
    ownerName: payload.ownerName,
    views: 0,
    avgRating: 0,
    ratingCount: 0,
    createdAt: createdAt
  };
  res.writeHead(201);
  res.end(JSON.stringify(newItem));
  return;
}
    if (url.startsWith('/api/listings/') && req.method === 'PUT') {
      const id = parseInt(url.split('/').pop());
      const list = readJSON(DATA_FILE);
      const idx = list.findIndex(x => x.id === id);
      if (idx === -1) { res.writeHead(404); res.end('{"error":"not found"}'); return; }
      list[idx] = Object.assign(list[idx], payload, { id });
      writeJSON(DATA_FILE, list);
      res.writeHead(200);
      res.end(JSON.stringify(list[idx]));
      return;
    }

    if (url.startsWith('/api/listings/') && req.method === 'DELETE') {
      const id = parseInt(url.split('/').pop());
      let list = readJSON(DATA_FILE);
      list = list.filter(x => x.id !== id);
      writeJSON(DATA_FILE, list);
      res.writeHead(200);
      res.end('{"ok":true}');
      return;
    }

    // İlan görüntülenme sayısı
    if (url.match(/^\/api\/listings\/\d+\/view$/) && req.method === 'POST') {
      const id = parseInt(url.split('/')[3]);
      const list = readJSON(DATA_FILE);
      const item = list.find(x => x.id === id);
      if (item) {
        item.views = (item.views || 0) + 1;
        writeJSON(DATA_FILE, list);
      }
      res.writeHead(200);
      res.end('{"ok":true}');
      return;
    }

    // ===== KULLANICILAR =====
    if (url === '/api/register' && req.method === 'POST') {
      const existing = db.query("SELECT id FROM users WHERE username = ?", [payload.username]);
      if (existing.length > 0) {
        res.writeHead(400);
        res.end('{"error":"Bu kullanıcı adı alınmış"}');
        return;
      }
      bcrypt.hash(payload.password, 10, (err, hash) => {
        if (err) { res.writeHead(500); res.end('{"error":"Hash hatası"}'); return; }
        const user = {
          id: Date.now(),
          username: payload.username,
          password: hash,
          role: payload.username === 'admin' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        db.run("INSERT INTO users (id, username, password, role, created_at) VALUES (?,?,?,?,?)",
          [user.id, user.username, user.password, user.role, user.createdAt]);
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES }
        );
        res.writeHead(201);
        res.end(JSON.stringify({ id:user.id, username:user.username, role:user.role, token:token }));
      });
      return;
    }

    if (url === '/api/login' && req.method === 'POST') {
      const users = db.query("SELECT * FROM users WHERE username = ?", [payload.username]);
      const u = users.length > 0 ? users[0] : null;
      if (!u) { res.writeHead(401); res.end('{"error":"Kullanıcı adı veya şifre hatalı"}'); return; }
      bcrypt.compare(payload.password, u.password, (err, ok) => {
        if (err || !ok) { res.writeHead(401); res.end('{"error":"Kullanıcı adı veya şifre hatalı"}'); return; }
        const token = jwt.sign(
          { id: u.id, username: u.username, role: u.role },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES }
        );
        res.writeHead(200);
        res.end(JSON.stringify({ id:u.id, username:u.username, role:u.role, token:token }));
      });
      return;
    }

// ===== ME (JWT test) =====
if (url === '/api/me' && req.method === 'GET') {
  const user = verifyToken(req);
  if (!user) { res.writeHead(401); res.end('{"error":"Token gerekli"}'); return; }
  res.writeHead(200);
  res.end(JSON.stringify(user));
  return;
}

// ===== MESAJLAR =====
if (url === '/api/users' && req.method === 'GET') {
      const users = db.query("SELECT id, username, role, created_at as createdAt FROM users");
      res.writeHead(200);
      res.end(JSON.stringify(users));
      return;
    }


if (url === '/api/messages' && req.method === 'GET') {
  const rows = db.query("SELECT * FROM messages ORDER BY created_at DESC");
  const msgs = rows.map(r => ({
    id: r.id,
    fromId: r.from_id,
    fromName: r.from_name,
    toId: r.to_id,
    toName: r.to_name,
    listingId: r.listing_id,
    text: r.text,
    read: r.read === 1,
    createdAt: r.created_at
  }));
  res.writeHead(200);
  res.end(JSON.stringify(msgs));
  return;
}
if (url === '/api/messages' && req.method === 'POST') {
  const msgId = Date.now();
  const createdAt = new Date().toISOString();
  db.run(
    "INSERT INTO messages (id, from_id, from_name, to_id, to_name, listing_id, text, read, created_at) VALUES (?,?,?,?,?,?,?,0,?)",
    [msgId, payload.fromId, payload.fromName, payload.toId, payload.toName, payload.listingId || null, payload.text, createdAt]
  );
  const msg = {
    id: msgId,
    fromId: payload.fromId,
    fromName: payload.fromName,
    toId: payload.toId,
    toName: payload.toName,
    listingId: payload.listingId,
    text: payload.text,
    read: false,
    createdAt: createdAt
  };
  res.writeHead(201);
  res.end(JSON.stringify(msg));
  return;
}

// Kullanıcının mesajlarını getir
if (url.startsWith('/api/messages/user/') && req.method === 'GET') {
  const userId = parseInt(url.split('/').pop());
  const rows = db.query("SELECT * FROM messages WHERE from_id = ? OR to_id = ? ORDER BY created_at ASC", [userId, userId]);
  const mine = rows.map(r => ({
    id: r.id,
    fromId: r.from_id,
    fromName: r.from_name,
    toId: r.to_id,
    toName: r.to_name,
    listingId: r.listing_id,
    text: r.text,
    read: r.read === 1,
    createdAt: r.created_at
  }));
  res.writeHead(200);
  res.end(JSON.stringify(mine));
  return;
}

// Mesajı okundu yap
if (url.match(/^\/api\/messages\/\d+\/read$/) && req.method === 'POST') {
  const id = parseInt(url.split('/')[3]);
  db.run("UPDATE messages SET read = 1 WHERE id = ?", [id]);
  res.writeHead(200);
  res.end('{"ok":true}');
  return;
}

    // ===== RESİM YÜKLEME =====
    if (url === '/api/upload' && req.method === 'POST') {
      // payload: { filename, dataUrl }
      const uploadsDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      const ext = (payload.filename || 'img.jpg').split('.').pop();
      const safeName = 'img_' + Date.now() + '.' + ext;
      const base64 = (payload.dataUrl || '').split(',')[1] || '';
      fs.writeFileSync(path.join(uploadsDir, safeName), Buffer.from(base64, 'base64'));
      res.writeHead(201);
      res.end(JSON.stringify({ url: '/uploads/' + safeName }));
      return;
    }

    res.writeHead(404);
    res.end('{"error":"unknown endpoint"}');
  });
}

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('🚀 EmlakPro sunucu çalışıyor: http://localhost:' + PORT);
    console.log('📁 Data klasörü: ' + path.join(__dirname, 'data'));
  });
}

module.exports = server;
