require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const bcrypt = require('bcryptjs');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
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

  // ===== STATIC =====
  let filePath = url === '/' ? '/index.html' : url;
  filePath = path.join(__dirname, decodeURIComponent(filePath));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
      res.end('404 - Bulunamadı');
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
      res.writeHead(200);
      res.end(JSON.stringify(readJSON(DATA_FILE)));
      return;
    }

    if (url === '/api/listings' && req.method === 'POST') {
      const list = readJSON(DATA_FILE);
      const newItem = payload;
      newItem.id = Date.now();
      newItem.createdAt = new Date().toISOString();
      newItem.views = 0;
      // Çoklu resim desteği - images dizisi yoksa oluştur
      if (!newItem.images || !Array.isArray(newItem.images)) {
      newItem.images = newItem.img ? [newItem.img] : [];
    }
      list.push(newItem);
      writeJSON(DATA_FILE, list);
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
      const users = readJSON(USERS_FILE);
      if (users.find(u => u.username === payload.username)) {
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
        users.push(user);
        writeJSON(USERS_FILE, users);
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
      const users = readJSON(USERS_FILE);
      const u = users.find(x => x.username === payload.username);
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
      const users = readJSON(USERS_FILE);
      const safeUsers = users.map(u => ({ id: u.id, username: u.username, role: u.role, createdAt: u.createdAt }));
      res.writeHead(200);
      res.end(JSON.stringify(safeUsers));
      return;
    }

    if (url === '/api/messages' && req.method === 'GET') {
  res.writeHead(200);
  res.end(JSON.stringify(readJSON(MSGS_FILE)));
  return;
}

if (url === '/api/messages' && req.method === 'POST') {
  const list = readJSON(MSGS_FILE);
  const msg = Object.assign({}, payload, {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    read: false
  });
  list.push(msg);
  writeJSON(MSGS_FILE, list);
  res.writeHead(201);
  res.end(JSON.stringify(msg));
  return;
}

// Kullanıcının mesajlarını getir
if (url.startsWith('/api/messages/user/') && req.method === 'GET') {
  const userId = parseInt(url.split('/').pop());
  const all = readJSON(MSGS_FILE);
  const mine = all.filter(m => m.fromId === userId || m.toId === userId);
  res.writeHead(200);
  res.end(JSON.stringify(mine));
  return;
}

// Mesajı okundu yap
if (url.match(/^\/api\/messages\/\d+\/read$/) && req.method === 'POST') {
  const id = parseInt(url.split('/')[3]);
  const list = readJSON(MSGS_FILE);
  const msg = list.find(m => m.id === id);
  if (msg) { msg.read = true; writeJSON(MSGS_FILE, list); }
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

server.listen(PORT, () => {
  console.log('🚀 EmlakPro sunucu çalışıyor: http://localhost:' + PORT);
  console.log('📁 Data klasörü: ' + path.join(__dirname, 'data'));
});
