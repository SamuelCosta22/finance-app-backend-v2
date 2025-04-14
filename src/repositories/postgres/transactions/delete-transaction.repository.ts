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
      console.error(error);
      return null;
    }
  }
}
