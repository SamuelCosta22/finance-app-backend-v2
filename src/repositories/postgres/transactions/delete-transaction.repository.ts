import { TransactionNotFoundError } from '../../../errors/transaction.ts';
import { prisma } from '../../../lib/prisma.ts';

export class PostgresDeleteTransactionRepository {
  async execute(transactionId: string) {
    try {
      return await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
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
