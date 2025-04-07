import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresGetUserByEmailRepository {
  async execute(email: string) {
    const user = await PostgresHelper.query(
      'SELECT * FROM users WHERE emailo = $1;',
      [email],
    );

    return user[0];
  }
}
