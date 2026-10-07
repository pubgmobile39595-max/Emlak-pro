const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

let migrated = 0;
let skipped = 0;

async function migrate(){
  for (let i = 0; i < users.length; i++){
    const u = users[i];
    // bcrypt hash $2a$ veya $2b$ ile başlar
    if (u.password && (u.password.startsWith('$2a$') || u.password.startsWith('$2b$'))){
      console.log('⏭️  ' + u.username + ' zaten hash\'li');
      skipped++;
      continue;
    }
    // Düz metin şifreyi hash'le
    const hash = await bcrypt.hash(u.password, 10);
    u.password = hash;
    console.log('✅ ' + u.username + ' hash\'lendi');
    migrated++;
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('');
  console.log('═══════════════════════════════');
  console.log('📊 SONUÇ:');
  console.log('  ✅ Migrate: ' + migrated);
  console.log('  ⏭️  Atlandı: ' + skipped);
  console.log('═══════════════════════════════');
}

migrate().catch(err => {
  console.error('❌ Hata:', err);
  process.exit(1);
});
