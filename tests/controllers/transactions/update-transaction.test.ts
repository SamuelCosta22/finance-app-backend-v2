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

  it('should return 400 when transaction id is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      params: { transactionId: 'invalid_id' },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when unallowed field is provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        unallowed_field: 'unallowed_field',
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when amount is provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        amount: 'invalid_amount',
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        type: 'invalid_type',
      },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });
});
