import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../../generated/prisma/client.js';
import { GetTransactionsByUserIdController } from '../../../src/controllers/transactions/get-transactions-by-user-id.controller.ts';
import { GetTransactionsByUserIdUseCase } from '../../../src/usecases/transactions/get-transactions-by-user-id.usecase.ts';

class GetTransactionsByUserIdUseCaseStub {
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

describe('Get Transactions By User Id', () => {
  const makeSut = () => {
    const getTransactionsByUserIdUseCase =
      new GetTransactionsByUserIdUseCaseStub() as unknown as GetTransactionsByUserIdUseCase;
    const sut = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase,
    );

    return { getTransactionsByUserIdUseCase, sut };
  };

  it('should return 200 when finding transactions by user id successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      query: { user_id: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(200);
  });
});
