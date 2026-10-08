require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
const JWT_EXPIRES = '7d';

describe('🔑 JWT - Token Testleri', () => {

  test('token üretir', () => {
    const payload = { id: 123, username: 'test', role: 'user' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  test('token doğrulanır', () => {
    const payload = { id: 123, username: 'test', role: 'user' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.id).toBe(123);
    expect(decoded.username).toBe('test');
    expect(decoded.role).toBe('user');
  });

  test('yanlış secret ile token doğrulanmaz', () => {
    const payload = { id: 123 };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    expect(() => jwt.verify(token, 'yanlis-secret')).toThrow();
  });

  test('geçersiz token hata verir', () => {
    expect(() => jwt.verify('gecersiz.token.burada', JWT_SECRET)).toThrow();
  });

  test('süresi dolmuş token hata verir', () => {
    const payload = { id: 123 };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });

  test('admin rolü token da saklanır', () => {
    const payload = { id: 999, username: 'admin', role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.role).toBe('admin');
  });

  test('token payload base64 olarak saklanır', () => {
    const payload = { id: 123, username: 'test' };
    const token = jwt.sign(payload, JWT_SECRET);
    const parts = token.split('.');
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    expect(decoded.id).toBe(123);
    expect(decoded.username).toBe('test');
  });

  test('iat ve exp alanları var', () => {
    const payload = { id: 123 };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});
