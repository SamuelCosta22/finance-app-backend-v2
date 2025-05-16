import { prisma } from '../../../lib/prisma.ts';
import { TransactionEnum } from '../../../types/transactions/CreateTransactionParams.ts';

export class PostgresGetUserBalanceRepository {
  async execute(userId: string, from: Date, to: Date) {
    const dateFilter = {
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };

    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: TransactionEnum.EXPENSE,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const {
      _sum: { amount: totalEarnings },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: TransactionEnum.EARNING,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const {
      _sum: { amount: totalInvestments },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: TransactionEnum.INVESTMENT,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const _totalEarnings = totalEarnings ? Number(totalEarnings) : 0;
    const _totalExpenses = totalExpenses ? Number(totalExpenses) : 0;
    const _totalInvestments = totalInvestments ? Number(totalInvestments) : 0;

    const total = _totalEarnings + _totalExpenses + _totalInvestments;

    const balance = _totalEarnings - _totalExpenses - _totalInvestments;

    const earningsPercentage =
      total === 0 ? 0 : Math.floor((_totalEarnings / total) * 100);
    const expensesPercentage =
      total === 0 ? 0 : Math.floor((_totalExpenses / total) * 100);
    const investmentsPercentage =
      total === 0 ? 0 : Math.floor((_totalInvestments / total) * 100);

    return {
      earnings: _totalEarnings,
      expenses: _totalExpenses,
      investments: _totalInvestments,
      earningsPercentage,
      expensesPercentage,
      investmentsPercentage,
      balance,
    };
  }
}
