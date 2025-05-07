import request from 'supertest';
import { app } from '../../src/server.ts';
import { user } from '../fixtures/user.ts';

describe('User Routes E2E Tests', () => {
  it('POST /users should return 201 when user is created', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    expect(response.status).toBe(201);
  });
});
