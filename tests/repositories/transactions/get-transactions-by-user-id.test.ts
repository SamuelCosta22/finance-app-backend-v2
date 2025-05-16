import { jest } from '@jest/globals';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetTransactionsByUserIdRepository } from '../../../src/repositories/postgres/transactions/get-transactions-by-user-id.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user } from '../../fixtures/user.ts';
import dayjs from 'dayjs';

describe('Get Transactions By User Id Repository', () => {
  const from = new Date('2022-01-01');
  const to = new Date('2022-01-31');
  const date = new Date('2022-01-15');

  it('should get transactions by user id on db', async () => {
    //arrange
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, date, user_id: user.id },
    });
    const sut = new PostgresGetTransactionsByUserIdRepository();

    //act
    const result = await sut.execute(user.id, from, to);

    //assert
    expect(result.length).toBe(1);
    expect(result[0].name).toBe(transaction.name);
    expect(result[0].type).toBe(transaction.type);
    expect(result[0].user_id).toBe(user.id);
    expect(String(result[0].amount)).toBe(String(transaction.amount));

    expect(dayjs(result[0].date).daysInMonth()).toBe(dayjs(date).daysInMonth());
    expect(dayjs(result[0].date).month()).toBe(dayjs(date).month());
    expect(dayjs(result[0].date).year()).toBe(dayjs(date).year());
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetTransactionsByUserIdRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'findMany');

    //act
    await sut.execute(user.id, from, to);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: user.id,
        date: {
          gte: from,
          lte: to,
        },
      },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresGetTransactionsByUserIdRepository();
    jest
      .spyOn(prisma.transaction, 'findMany')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user.id, from, to);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
