import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresGetUserBalanceRepository {
  async execute(userId: string) {
    const balance = await PostgresHelper.query(
      `SELECT * FROM get_user_balance($1);`,
      [userId],
    );

    return {
      userId,
      ...balance[0],
    };
  }
}
