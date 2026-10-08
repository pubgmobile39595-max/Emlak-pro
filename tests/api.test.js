const request = require('supertest');
const server = require('../server');

describe('🌐 API Testleri', () => {

  test('GET /api/listings - 200 döner', async () => {
    const res = await request(server).get('/api/listings');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users - 200 döner', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/messages - 200 döner', async () => {
    const res = await request(server).get('/api/messages');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/register - yeni kullanıcı', async () => {
    const username = 'apitest_' + Date.now();
    const res = await request(server)
      .post('/api/register')
      .send({ username: username, password: 'test1234' });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe(username);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/register - duplicate 400', async () => {
    const res = await request(server)
      .post('/api/register')
      .send({ username: 'admin', password: 'admin' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/login - doğru şifre 200', async () => {
    const res = await request(server)
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/login - yanlış şifre 401', async () => {
    const res = await request(server)
      .post('/api/login')
      .send({ username: 'admin', password: 'yanlis' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/me - token yoksa 401', async () => {
    const res = await request(server).get('/api/me');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/me - token ile 200', async () => {
    const login = await request(server)
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    const token = login.body.token;

    const res = await request(server)
      .get('/api/me')
      .set('Authorization', 'Bearer ' + token);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('admin');
  });

  test('GET /bilinmeyen - 404', async () => {
    const res = await request(server).get('/api/bilinmeyen');
    expect(res.statusCode).toBe(404);
  });
});
