import { PostgresHelper } from '../../../db/postgres/helper.js';
import { CreateTransactionsParams } from '../../../types/transactions/CreateTransactionParams.ts';

export class PostgresCreateTransactionRepository {
  async execute(params: CreateTransactionsParams) {
    const createdTransaction = await PostgresHelper.query(
      'INSERT INTO transactions (id, user_id, name, date, amount, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      [
        params.id,
        params.user_id,
        params.name,
        params.date,
        params.amount,
        params.type,
      ],
    );

    return createdTransaction[0];
  }
}
