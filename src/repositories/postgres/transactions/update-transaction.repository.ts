import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
      if (error instanceof PrismaClientKnownRequestError) {
        // P2025 - "An operation failed because it depends on one or more records that were required but could not be found."
        if (error.code === 'P2025') {
          throw new TransactionNotFoundError(transactionId);
        }
      }
      console.error(error);
      throw error;
    }
  }
}
