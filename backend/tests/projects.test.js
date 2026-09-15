const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

let tokenA;
let tokenB;
let projectId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const a = await request(app).post('/api/auth/register').send({
    fullName: 'User A', email: 'a@example.com', password: 'SecurePass123',
  });
  tokenA = a.body.data.token;

  const b = await request(app).post('/api/auth/register').send({
    fullName: 'User B', email: 'b@example.com', password: 'SecurePass123',
  });
  tokenB = b.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Projects', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
  });

  it('creates a project for the authenticated user', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Website Redesign', description: 'Revamp the marketing site', status: 'In Progress' });

    expect(res.status).toBe(201);
    projectId = res.body.data.id;
  });

  it('rejects invalid status values', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Bad project', status: 'Not A Status' });

    expect(res.status).toBe(422);
  });

  it('prevents another user from accessing the project', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  it('prevents another user from deleting the project', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  it('allows the owner to fetch their project', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Website Redesign');
  });
});
