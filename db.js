const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'emlak.db');

let db = null;
let SQL = null;

async function initDatabase() {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const buffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(buffer);
    console.log('📂 Mevcut veritabanı yüklendi');
  } else {
    db = new SQL.Database();
    console.log('🆕 Yeni veritabanı oluşturuldu');
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      price INTEGER NOT NULL,
      type TEXT NOT NULL,
      rooms TEXT,
      area INTEGER,
      bath INTEGER,
      lat REAL,
      lng REAL,
      img TEXT,
      desc TEXT,
      phone TEXT,
      owner_id INTEGER,
      owner_name TEXT,
      views INTEGER DEFAULT 0,
      avg_rating REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_id INTEGER NOT NULL,
      from_name TEXT,
      to_id INTEGER NOT NULL,
      to_name TEXT,
      listing_id INTEGER,
      text TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
    CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
    CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_id);
  `);

  saveDatabase();
  console.log('✅ SQLite veritabanı hazır: data/emlak.db');
  return db;
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}

// Yardımcı: sorgu çalıştır ve sonucu obje dizisi olarak döndür
function query(sql, params) {
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Yardımcı: tek satır çalıştır
function run(sql, params) {
  db.run(sql, params);
  saveDatabase();
}

// Yardımcı: son eklenen ID'yi al
function lastInsertId() {
  const r = db.exec('SELECT last_insert_rowid() as id');
  return r[0].values[0][0];
}

module.exports = {
  initDatabase,
  query,
  run,
  saveDatabase,
  lastInsertId,
  getDb: () => db
};
