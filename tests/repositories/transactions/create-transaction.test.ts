import dayjs from 'dayjs';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresCreateTransactionRepository } from '../../../src/repositories/postgres/transactions/create-transaction.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user as fakeUser } from '../../fixtures/user.ts';

describe('Create Transaction Repository', () => {
  it('should create a transaction on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
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
});
