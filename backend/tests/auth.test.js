const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth', () => {
  const user = { fullName: 'Jane Doe', email: 'jane@example.com', password: 'SecurePass123' };

  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('rejects registration with invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ fullName: 'X', email: 'not-an-email', password: 'SecurePass123' });
    expect(res.status).toBe(422);
  });
});
