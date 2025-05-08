import request from 'supertest';
import { app } from '../../src/app.ts';
import { transaction } from '../fixtures/transaction.ts';
import { user } from '../fixtures/user.ts';

describe('Transaction Routes E2E Tests', () => {
  it('POST /api/transactions should return 201 when transaction is created', async () => {
    const { body } = await request(app)
      .post('/api/users')
      .send({ ...user, id: undefined });
    const createdUser = body.createdUser;

    const response = await request(app)
      .post('/api/transactions')
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    expect(response.status).toBe(201);
    expect(response.body.user_id).toBe(createdUser.id);
    expect(response.body.type).toBe(transaction.type);
    expect(response.body.amount).toBe(String(transaction.amount));
  });
});
