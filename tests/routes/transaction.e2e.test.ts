import request from 'supertest';
import { faker } from '@faker-js/faker';
import { transaction } from '../fixtures/transaction.ts';
import { user } from '../fixtures/user.ts';
import { TransactionEnum } from '../../src/types/transactions/CreateTransactionParams.ts';
import { app } from '../../src/app.ts';

describe('Transaction Routes E2E Tests', () => {
  it('POST /api/transactions should return 201 when transaction is created', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    expect(response.status).toBe(201);
    expect(response.body.user_id).toBe(createdUser.id);
    expect(response.body.type).toBe(transaction.type);
    expect(response.body.amount).toBe(String(transaction.amount));
  });

  it('GET /api/transactions should return 200 when transaction is found', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const from = '2023-01-01';
    const to = '2023-02-28';
    const date = new Date('2023-01-15');

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, date, user_id: createdUser.id, id: undefined });

    const response = await request(app)
      .get(`/api/transactions?from=${from}&to=${to}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body[0].id).toEqual(createdTransaction.id);
  });

  it('PATCH /api/transactions:transactionId should return 200 when transaction is updated', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const response = await request(app)
      .patch(`/api/transactions/${createdTransaction.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ amount: 100, type: TransactionEnum.INVESTMENT });

    expect(response.status).toBe(200);
    expect(response.body.amount).toBe('100');
    expect(response.body.type).toBe(TransactionEnum.INVESTMENT);
  });

  it('DELETE /api/transactions/:transactionId should return 200 when transaction is deleted', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const response = await request(app).delete(
      `/api/transactions/${createdTransaction.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdTransaction.id);
  });

  it('PATCH /api/transactions:transactionId should return 404 when updating a non-existing transaction', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .patch(`/api/transactions/${faker.string.uuid()}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ amount: 100, type: TransactionEnum.INVESTMENT });

    expect(response.status).toBe(404);
  });

  it('DELETE /api/transactions:transactionId should return 404 when deleting a non-existing transaction', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .delete(`/api/transactions/${faker.string.uuid()}`)
      .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
      .send({ amount: 100, type: TransactionEnum.INVESTMENT });

    expect(response.status).toBe(404);
  });
});
