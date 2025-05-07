import { faker } from '@faker-js/faker';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresUpdateTransactionRepository } from '../../../src/repositories/postgres/transactions/update-transaction.repository.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';
import { user } from '../../fixtures/user.ts';
import dayjs from 'dayjs';

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
});
