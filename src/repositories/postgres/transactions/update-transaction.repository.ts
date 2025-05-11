import { TransactionNotFoundError } from '../../../errors/transaction.ts';
import { prisma } from '../../../lib/prisma.ts';
import { CreateTransactionsParams } from '../../../types/transactions/CreateTransactionParams.ts';

export class PostgresUpdateTransactionRepository {
  async execute(transactionId: string, input: CreateTransactionsParams) {
    try {
      return await prisma.transaction.update({
        where: {
          id: transactionId,
        },
        data: input,
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new TransactionNotFoundError(transactionId);
      }
      console.error(error);
      throw error;
    }
  }
}
