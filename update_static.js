const fs = require('fs')
let h = fs.readFileSync('server.js', 'utf8')

// Eski blok (gerçek hali)
const oldBlock = `  // ===== STATIC =====
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
  });`

// Yeni blok (React dist sunar)
const newBlock = `  // ===== STATIC (React dist) =====
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
  });`

if (h.indexOf(oldBlock) > -1) {
  h = h.replace(oldBlock, newBlock)
  fs.writeFileSync('server.js', h)
  console.log('✅ server.js GÜNCELLENDİ (React dist)')
} else {
  console.log('❌ Hala bulunamadı')
}
