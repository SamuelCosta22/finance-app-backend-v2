import { CreateTransactionController } from '../../../src/controllers/transactions/create-transaction.controller.ts';
import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';

class CreateTransactionUseCaseStub {
  async execute(transaction: any) {
    return transaction;
  }
}

describe('Create Transaction Controller', () => {
  const makeSut = () => {
    //Switch Under Test
    const createTransactionUseCase = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCase);

    return { createTransactionUseCase, sut };
  };

  const httpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.EARNING,
      amount: Number(faker.finance.amount()),
    },
  };

  it('should return 201 when creating transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
  });

  it('should return 400 when missing user_id', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        user_id: undefined,
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing name', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        name: undefined,
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing date', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: undefined,
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });
});
