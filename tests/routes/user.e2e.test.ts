import request from 'supertest';
import { user } from '../fixtures/user.ts';
import { app } from '../../src/app.ts';

describe('User Routes E2E Tests', () => {
  it('POST /api/users should return 201 when user is created', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    expect(response.status).toBe(201);
  });

  it('GET /api/users/:id should return 200 when user is found', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const response = await request(app).get(`/api/users/${createdUser.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdUser);
  });
});
