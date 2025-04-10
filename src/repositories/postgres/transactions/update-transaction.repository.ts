import { PostgresHelper } from '../../../db/postgres/helper.js';
import { CreateTransactionsParams } from '../../../types/transactions/CreateTransactionParams.ts';

export class PostgresUpdateTransactionRepository {
  async execute(transactionId: string, input: CreateTransactionsParams) {
    const updateFields: string[] = [];
    const updateValues = [];

    Object.keys(input).forEach((key) => {
      const typedKey = key as keyof CreateTransactionsParams;
      updateFields.push(`${key} = $${updateValues.length + 1}`);
      updateValues.push(input[typedKey]);
    });

    updateValues.push(transactionId);

    const updateQuery = `
                UPDATE transactions
                SET ${updateFields.join(', ')}
                WHERE id = $${updateValues.length}
                RETURNING *
            `;

    const updatedTransaction = await PostgresHelper.query(
      updateQuery,
      updateValues,
    );

    return updatedTransaction[0];
  }
}
