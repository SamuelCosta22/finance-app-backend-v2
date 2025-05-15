import { prisma } from '../../../lib/prisma.ts';

export class PostgresGetTransactionByIdRepository {
  async execute(transactionId: string) {
    return await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
  }
}
