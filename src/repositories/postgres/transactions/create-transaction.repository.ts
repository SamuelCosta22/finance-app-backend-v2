import { prisma } from '../../../lib/prisma.ts';
import { CreateTransactionsParams } from '../../../types/transactions/CreateTransactionParams.ts';

export class PostgresCreateTransactionRepository {
  async execute(params: CreateTransactionsParams) {
    return await prisma.transaction.create({
      data: params,
    });
  }
}
