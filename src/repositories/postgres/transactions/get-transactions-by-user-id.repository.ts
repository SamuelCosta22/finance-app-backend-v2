import { prisma } from '../../../lib/prisma.ts';

export class PostgresGetTransactionsByUserIdRepository {
  async execute(user_id: string, from: Date, to: Date) {
    return await prisma.transaction.findMany({
      where: {
        user_id,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    });
  }
}
