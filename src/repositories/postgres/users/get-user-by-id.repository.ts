import { PostgresHelper } from '../../../db/postgres/helper.js';

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<any>; // Retorna uma Promise
}
export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const user = await PostgresHelper.query(
      'SELECT * FROM users WHERE id = $1;',
      [userId],
    );

    return user[0];
  }
}
