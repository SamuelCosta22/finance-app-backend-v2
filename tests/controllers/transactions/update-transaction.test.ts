import { faker } from '@faker-js/faker';
import { UpdateTransactionController } from '../../../src/controllers/transactions/update-transaction.controller.ts';
import { TransactionEnum } from '../../../generated/prisma/client.js';

class UpdateTransactionUseCaseStub {
  async execute() {
    return {
      user_id: faker.string.uuid(),
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.INVESTMENT,
      amount: Number(faker.finance.amount()),
    };
  }
}

describe('Update Transaction Controller', () => {
  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCase);

    return { updateTransactionUseCase, sut };
  };

  const httpRequest = {
    params: { transactionId: faker.string.uuid() },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.INVESTMENT,
      amount: Number(faker.finance.amount()),
    },
  };

  it('should return 200 when transaction is updated successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
  });
});
