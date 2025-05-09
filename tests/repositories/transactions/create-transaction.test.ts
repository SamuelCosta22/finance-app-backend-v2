import dayjs from 'dayjs';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresCreateTransactionRepository } from '../../../src/repositories/postgres/transactions/create-transaction.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

describe('Create Transaction Repository', () => {
  it('should create a transaction on db', async () => {
    //arrange
    await prisma.user.create({ data: user });
    const sut = new PostgresCreateTransactionRepository();

    //act
    const result = await sut.execute({ ...transaction, user_id: user.id });

    //assert
    expect(result.name).toBe(transaction.name);
    expect(result.type).toBe(transaction.type);
    expect(result.user_id).toBe(user.id);
    expect(String(result.amount)).toBe(String(transaction.amount));

    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user });
    const sut = new PostgresCreateTransactionRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'create');

    //act
    await sut.execute({ ...transaction, user_id: user.id });

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      data: { ...transaction, user_id: user.id },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresCreateTransactionRepository();
    jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
