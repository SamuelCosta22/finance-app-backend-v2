import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresGetTransactionsByUserIdRepository {
  async execute(user_id: string) {
    const transactions = await PostgresHelper.query(
      'SELECT * FROM transactions WHERE user_id = $1',
      [user_id],
    );

    return transactions;
  }
}
