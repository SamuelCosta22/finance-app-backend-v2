import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
      if (error instanceof PrismaClientKnownRequestError) {
        //P2025 - "An operation failed because it depends on one or more records that were required but could not be found."
        if (error.code === 'P2025') {
          throw new TransactionNotFoundError(transactionId);
        }
      }
      console.error(error);
      throw error;
    }
  }
}
