import { prisma } from '../../../lib/prisma.ts';

export class PostgresGetTransactionsByUserIdRepository {
  async execute(user_id: string) {
    return await prisma.transaction.findMany({
      where: {
        user_id,
      },
    });
  }
}
