import request from 'supertest';
import { user } from '../fixtures/user.ts';
import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../src/types/transactions/CreateTransactionParams.ts';
import { app } from '../../src/app.ts';

describe('User Routes E2E Tests', () => {
  it('POST /api/users should return 201 when user is created', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    expect(response.status).toBe(201);
  });

  it('GET /api/users/:id should return 200 when user is found', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app).get(`/api/users/${createdUser.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdUser);
  });

  it('PATCH /api/users/:id should return 200 when user is updated', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app)
      .patch(`/api/users/${createdUser.id}`)
      .send(updateUserParams);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(updateUserParams.first_name);
    expect(response.body.last_name).toBe(updateUserParams.last_name);
    expect(response.body.email).toBe(updateUserParams.email);
    expect(response.body.password).not.toBe(createdUser.password);
  });

  it('DELETE /api/users/:id should return 200 when user is deleted', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app).delete(`/api/users/${createdUser.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdUser);
  });

  it('GET /api/users/:userId/balance should return 200 when user balance is found', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    await request(app).post('/api/transactions').send({
      user_id: createdUser.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.EARNING,
      amount: 10000,
    });

    await request(app).post('/api/transactions').send({
      user_id: createdUser.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.EXPENSE,
      amount: 2000,
    });

    await request(app).post('/api/transactions').send({
      user_id: createdUser.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.INVESTMENT,
      amount: 1000,
    });

    const response = await request(app).get(
      `/api/users/${createdUser.id}/balance`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      earnings: 10000,
      expenses: 2000,
      investments: 1000,
      balance: 7000,
    });
  });

  it('GET /api/users/:userId should return 404 when user is not found', async () => {
    const response = await request(app).get(
      `/api/users/${faker.string.uuid()}`,
    );

    expect(response.status).toBe(404);
  });

  it('GET /api/users/:userId/balance should return 404 when user is not found', async () => {
    const response = await request(app).get(
      `/api/users/${faker.string.uuid()}/balance`,
    );

    expect(response.status).toBe(404);
  });

  it('PATCH /api/users/:id should return 404 when user is not found', async () => {
    const response = await request(app)
      .patch(`/api/users/${faker.string.uuid()}`)
      .send({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

    expect(response.status).toBe(404);
  });

  it('POST /api/users should return 400 when email is already in use', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined, email: createdUser.email });

    expect(response.status).toBe(400);
  });

  it('PATCH /api/users/:id should return 400 when email is already in use', async () => {
    const user1 = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const user2 = await request(app)
      .post('/api/users')
      .send({ ...user, email: faker.internet.email(), id: undefined });

    const response = await request(app)
      .patch(`/api/users/${user2.body.createdUser.id}`)
      .send({ email: user1.body.createdUser.email });

    expect(response.status).toBe(400);
  });

  it('POST /api/users should return 400 when password is too short', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined, password: '123' });

    expect(response.status).toBe(400);
  });

  it('PATCH /api/users/:id should return 400 when password is too short', async () => {
    const response = await request(app)
      .patch(`/api/users/${faker.string.uuid()}`)
      .send({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: '123',
      });

    expect(response.status).toBe(400);
  });

  it('POST /api/users/login should return 200 and tokens when user credentials are valid', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: createdUser.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body.tokens.accessToken).toBeDefined();
    expect(response.body.tokens.refreshToken).toBeDefined();
  });
});
