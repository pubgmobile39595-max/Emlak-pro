const bcrypt = require('bcryptjs');

describe('🔐 bcrypt - Şifre Hash Testleri', () => {
  
  test('şifreyi hash eder', async () => {
    const password = 'test1234';
    const hash = await bcrypt.hash(password, 10);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
    expect(hash.startsWith('$2b$') || hash.startsWith('$2a$')).toBe(true);
  });

  test('aynı şifre farklı hash üretir (salt)', async () => {
    const password = 'test1234';
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    expect(hash1).not.toBe(hash2);
  });

  test('doğru şifre ile hash eşleşir', async () => {
    const password = 'test1234';
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
  });

  test('yanlış şifre ile hash eşleşmez', async () => {
    const hash = await bcrypt.hash('test1234', 10);
    const match = await bcrypt.compare('yanlis_sifre', hash);
    expect(match).toBe(false);
  });

  test('boş şifre hash edilebilir', async () => {
    const hash = await bcrypt.hash('', 10);
    expect(hash.startsWith('$2b$') || hash.startsWith('$2a$')).toBe(true);
  });

  test('uzun şifre hash edilebilir', async () => {
    const longPass = 'a'.repeat(100);
    const hash = await bcrypt.hash(longPass, 10);
    const match = await bcrypt.compare(longPass, hash);
    expect(match).toBe(true);
  });

  test('Türkçe karakterli şifre hash edilebilir', async () => {
    const password = 'şifre123ğüç';
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);
  });
});
