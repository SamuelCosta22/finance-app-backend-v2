import dayjs from 'dayjs';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetTransactionsByUserIdRepository } from '../../../src/repositories/postgres/transactions/get-transactions-by-user-id.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user } from '../../fixtures/user.ts';

describe('Get Transactions By User Id Repository', () => {
  it('should get transactions by user id on db', async () => {
    //arrange
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const sut = new PostgresGetTransactionsByUserIdRepository();

    //act
    const result = await sut.execute(user.id);

    //assert
    expect(result.length).toBe(1);
    expect(result[0].name).toBe(transaction.name);
    expect(result[0].type).toBe(transaction.type);
    expect(result[0].user_id).toBe(user.id);
    expect(String(result[0].amount)).toBe(String(transaction.amount));

    expect(dayjs(result[0].date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(result[0].date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result[0].date).year()).toBe(dayjs(transaction.date).year());
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetTransactionsByUserIdRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'findMany');

    //act
    await sut.execute(user.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: user.id,
      },
    });
  });
});
