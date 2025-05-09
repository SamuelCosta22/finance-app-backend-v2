import { faker } from '@faker-js/faker';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresUpdateTransactionRepository } from '../../../src/repositories/postgres/transactions/update-transaction.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';
import { user } from '../../fixtures/user.ts';
import dayjs from 'dayjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TransactionNotFoundError } from '../../../src/errors/transaction.ts';
import { jest } from '@jest/globals';

describe('Update Transaction Repository', () => {
  it('should update a transaction in db', async () => {
    //arrange
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const sut = new PostgresUpdateTransactionRepository();
    const updateParams = {
      id: faker.string.uuid(),
      user_id: user.id,
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      amount: Number(faker.finance.amount()),
      type: TransactionEnum.EARNING,
    };

    //act
    const result = await sut.execute(transaction.id, updateParams);

    //assert
    expect(result.id).toBe(updateParams.id);
    expect(result!.name).toBe(updateParams.name);
    expect(result!.type).toBe(updateParams.type);
    expect(result!.user_id).toBe(user.id);
    expect(String(result!.amount)).toBe(String(updateParams.amount));

    expect(dayjs(result!.date).daysInMonth()).toBe(
      dayjs(updateParams.date).daysInMonth(),
    );
    expect(dayjs(result!.date).month()).toBe(dayjs(updateParams.date).month());
    expect(dayjs(result!.date).year()).toBe(dayjs(updateParams.date).year());
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: {
        ...transaction,
        user_id: user.id,
      },
    });
    const sut = new PostgresUpdateTransactionRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'update');

    //act
    await sut.execute(transaction.id, { ...transaction, user_id: user.id });

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
      data: { ...transaction, user_id: user.id },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresUpdateTransactionRepository();
    jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction.id, {
      ...transaction,
      user_id: user.id,
    });

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw TransactionNotFoundError if Prisma does not find record to update', async () => {
    //arrange
    const sut = new PostgresUpdateTransactionRepository();
    jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '4.9.0',
      }),
    );

    //act
    const promise = sut.execute(transaction.id, {
      ...transaction,
      user_id: user.id,
    });

    //assert
    await expect(promise).rejects.toThrow(TransactionNotFoundError);
  });
});
