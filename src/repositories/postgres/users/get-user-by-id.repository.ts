import { PostgresHelper } from '../../../db/postgres/helper.js';
import { IGetUserByIdRepository } from '../../../types/repositories/users.repository.ts';

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const user = await PostgresHelper.query(
      'SELECT * FROM users WHERE id = $1;',
      [userId],
    );

    return user[0];
  }
}
