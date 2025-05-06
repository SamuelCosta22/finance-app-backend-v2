import { faker } from '@faker-js/faker';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetUserBalanceRepository } from '../../../src/repositories/postgres/users/get-user-balance.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';
import { TransactionEnum } from '../../../generated/prisma/client.js';

describe('Get User Balance Repository', () => {
  describe('Get User Balance Repository', () => {
    it('should get user balance on db', async () => {
      // Arrange: Criação de usuário
      const user = await prisma.user.create({
        data: fakeUser,
      });

      // Verifique se o ID do usuário foi gerado corretamente
      console.log(user.id); // Adicione um log para verificar o ID gerado

      // Criação das transações associadas ao usuário
      await prisma.transaction.createMany({
        data: [
          {
            name: faker.commerce.productName(),
            amount: 20000,
            date: faker.date.anytime(),
            type: 'EARNING',
            user_id: user.id, // Associe o ID do usuário corretamente
          },
          {
            name: faker.commerce.productName(),
            amount: 1000,
            date: faker.date.anytime(),
            type: 'EXPENSE',
            user_id: user.id, // Associe o ID do usuário corretamente
          },
          {
            name: faker.commerce.productName(),
            amount: 3000,
            date: faker.date.anytime(),
            type: 'INVESTMENT',
            user_id: user.id, // Associe o ID do usuário corretamente
          },
        ],
      });

      const sut = new PostgresGetUserBalanceRepository();

      // Act: Obtenha o saldo do usuário
      const result = await sut.execute(user.id);

      // Assert: Verifique os valores
      expect(result.earnings.toString()).toBe('20000');
      expect(result.expenses.toString()).toBe('1000');
      expect(result.investments.toString()).toBe('3000');
      expect(result.balance.toString()).toBe('16000');
    });
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetUserBalanceRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate');

    //act
    await sut.execute(fakeUser.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionEnum.EARNING,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionEnum.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionEnum.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    });
  });
});
