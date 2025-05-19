import request from 'supertest';
import { user } from '../fixtures/user.ts';
import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../src/types/transactions/CreateTransactionParams.ts';
import { app } from '../../src/app.ts';

const from = '2022-01-01';
const to = '2022-01-31';

describe('User Routes E2E Tests', () => {
  it('POST /api/users should return 201 when user is created', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    expect(response.status).toBe(201);
  });

  it('GET /api/users/me should return 200 if user is authenticated', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUser.id);
  });

  it('PATCH /api/users/me should return 200 when user params are updated', async () => {
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
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send(updateUserParams);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(updateUserParams.first_name);
    expect(response.body.last_name).toBe(updateUserParams.last_name);
    expect(response.body.email).toBe(updateUserParams.email);
    expect(response.body.password).not.toBe(createdUser.password);
  });

  it('DELETE /api/users/me should return 200 when user is deleted', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUser.id);
  });

  it('GET /api/users/me/balance should return 200 when user balance is found', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    await request(app)
      .post('/api/transactions/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: new Date(from),
        type: TransactionEnum.EARNING,
        amount: 10000,
      });

    await request(app)
      .post('/api/transactions/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: new Date(from),
        type: TransactionEnum.EXPENSE,
        amount: 2000,
      });

    await request(app)
      .post('/api/transactions/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: new Date(to),
        type: TransactionEnum.INVESTMENT,
        amount: 1000,
      });

    const response = await request(app)
      .get(`/api/users/me/balance?from=${from}&to=${to}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      earnings: 10000,
      expenses: 2000,
      investments: 1000,
      balance: 7000,
      earningsPercentage: 76,
      expensesPercentage: 15,
      investmentsPercentage: 7,
    });
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

  it('PATCH /api/users/me should return 400 when email is already in use', async () => {
    const user1 = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const user2 = await request(app)
      .post('/api/users')
      .send({ ...user, email: faker.internet.email(), id: undefined });

    const response = await request(app)
      .patch(`/api/users/me`)
      .set(
        'Authorization',
        `Bearer ${user2.body.createdUser.tokens.accessToken}`,
      )
      .send({ email: user1.body.createdUser.email });

    expect(response.status).toBe(400);
  });

  it('POST /api/users should return 400 when password is too short', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined, password: '123' });

    expect(response.status).toBe(400);
  });

  it('PATCH /api/users/me should return 400 when password is too short', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });

    const createdUser = body.createdUser;

    const response = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: '123',
      });

    expect(response.status).toBe(400);
  });
});
