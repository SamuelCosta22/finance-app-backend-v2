import request from 'supertest';
import { app } from '../../src/app.ts';
import { user } from '../fixtures/user.ts';

describe('Auth Routes E2E Tests', () => {
  it('POST /api/auth/login should return 200 and tokens when user credentials are valid', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: createdUser.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body.tokens.accessToken).toBeDefined();
    expect(response.body.tokens.refreshToken).toBeDefined();
  });

  it('POST /api/auth/login should return 400 when password is too short', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ ...user, id: undefined, password: '123' });

    expect(response.status).toBe(400);
  });

  it('POST /api/auth/refresh-token should return 200 and tokens when refresh token is valid', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: createdUser.tokens.refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.tokens.accessToken).toBeDefined();
    expect(response.body.tokens.refreshToken).toBeDefined();
  });
});
