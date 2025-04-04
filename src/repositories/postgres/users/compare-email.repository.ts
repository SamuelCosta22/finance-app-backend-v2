import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresCompareEmail {
  async execute(email: string) {
    try {
      const result = await PostgresHelper.query(
        'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS "exists";',
        [email],
      );
      return result;
    } catch (error) {
      console.error('Error in emailExists function:', error);
      throw error;
    }
  }
}
