import { prisma } from '../../../lib/prisma.ts';
import { CreateTransactionsParams } from '../../../types/transactions/CreateTransactionParams.ts';

export class PostgresUpdateTransactionRepository {
  async execute(transactionId: string, input: CreateTransactionsParams) {
    return await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: input,
    });
  }
}
