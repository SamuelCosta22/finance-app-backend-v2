import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresGetUserBalanceRepository {
  async execute(userId: string) {
    const balance = await PostgresHelper.query(
      `SELECT
                SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 AND) AS earnings,
                SMU(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
                SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
                (
                    SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) -
                    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) -
                    SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
                ) AS balance
            FROM transactions
            WHERE user_id = $1;`,
      [userId],
    );

    return {
      userId,
      ...balance[0],
    };
  }
}
