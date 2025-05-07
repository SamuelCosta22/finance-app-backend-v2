import dayjs from 'dayjs';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresDeleteTransactionRepository } from '../../../src/repositories/postgres/transactions/delete-transaction.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user } from '../../fixtures/user.ts';

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
    expect(result!.name).toBe(transaction.name);
    expect(result!.type).toBe(transaction.type);
    expect(result!.user_id).toBe(user.id);
    expect(String(result!.amount)).toBe(String(transaction.amount));

    expect(dayjs(result!.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(result!.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result!.date).year()).toBe(dayjs(transaction.date).year());
  });
});
