import { PostgresHelper } from '../../../db/postgres/helper.js';
import { CreateUserParams } from '../../../types/users/CreateUserParams.ts';

export class PostgresUpdateUserRepository {
  async execute(userId: string, input: CreateUserParams) {
    const updateFields: string[] = [];
    const updateValues = [];

    Object.keys(input).forEach((key) => {
      const typedKey = key as keyof CreateUserParams;
      updateFields.push(`${key} = $${updateValues.length + 1}`);
      updateValues.push(input[typedKey]);
    });

    updateValues.push(userId);

    const updateQuery = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = $${updateValues.length}
        RETURNING *
    `;

    const updatedUser = await PostgresHelper.query(updateQuery, updateValues);

    return updatedUser[0];
  }
}
