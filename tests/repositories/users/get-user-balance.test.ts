import { faker } from '@faker-js/faker';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetUserBalanceRepository } from '../../../src/repositories/postgres/users/get-user-balance.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';
import { jest } from '@jest/globals';

const from = new Date('2023-01-01');
const to = new Date('2023-01-31');

describe('Get User Balance Repository', () => {
  it('should get user balance on db', async () => {
    // Arrange
    const user = await prisma.user.create({
      data: fakeUser,
    });

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.commerce.productName(),
          amount: 20000,
          date: from,
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.commerce.productName(),
          amount: 1000,
          date: from,
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.commerce.productName(),
          amount: 3000,
          date: to,
          type: 'INVESTMENT',
          user_id: user.id,
        },
      ],
    });

    const sut = new PostgresGetUserBalanceRepository();

    // Act
    const result = await sut.execute(user.id, from, to);

    // Assert
    expect(result.earnings.toString()).toBe('20000');
    expect(result.expenses.toString()).toBe('1000');
    expect(result.investments.toString()).toBe('3000');
    expect(result.balance.toString()).toBe('16000');
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate');

    //act
    await sut.execute(fakeUser.id, from, to);

    //assert
    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionEnum.EARNING,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionEnum.EXPENSE,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionEnum.INVESTMENT,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository();
    jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(fakeUser.id, from, to);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
