import dayjs from 'dayjs';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresDeleteTransactionRepository } from '../../../src/repositories/postgres/transactions/delete-transaction.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user } from '../../fixtures/user.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TransactionNotFoundError } from '../../../src/errors/transaction.ts';
import { jest } from '@jest/globals';

describe('Delete Transaction Repository', () => {
  it('should delete a transaction in db', async () => {
    //arrange
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const sut = new PostgresDeleteTransactionRepository();

    //act
    const result = await sut.execute(transaction.id);

    //assert
    expect(result.name).toBe(transaction.name);
    expect(result.type).toBe(transaction.type);
    expect(result.user_id).toBe(user.id);
    expect(String(result.amount)).toBe(String(transaction.amount));

    expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const sut = new PostgresDeleteTransactionRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'delete');

    //act
    await sut.execute(transaction.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
    });
  });

  it('should throw Generic Error if Prisma throws generic error', async () => {
    //arrange
    const sut = new PostgresDeleteTransactionRepository();
    jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction.id);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw TransactionNotFoundError if Prisma throws P2025', async () => {
    //arrange
    const sut = new PostgresDeleteTransactionRepository();
    jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '4.9.0',
      }),
    );

    //act
    const promise = sut.execute(transaction.id);

    //assert
    await expect(promise).rejects.toThrow(TransactionNotFoundError);
  });
});
