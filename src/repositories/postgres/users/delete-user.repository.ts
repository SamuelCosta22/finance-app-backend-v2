import { PostgresHelper } from '../../../db/postgres/helper.js';

export interface IDeleteUserRepository {
  execute(userId: string): Promise<any>; // Retorna uma Promise
}

export class PostgresDeleteUserRepository {
  async execute(userId: string) {
    const deletedUser = await PostgresHelper.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId],
    );

    return deletedUser[0];
  }
}
