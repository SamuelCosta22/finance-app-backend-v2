import { CreateTransactionController } from '../../../src/controllers/transactions/create-transaction.controller.ts';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { jest } from '@jest/globals';

class CreateTransactionUseCaseStub {
  async execute() {
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
      ...transaction,
      id: undefined,
    },
  };

  it('should return 201 when creating transaction successfully (earning)', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
  });

  it('should return 201 when creating transaction successfully (expense)', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: TransactionEnum.EXPENSE,
      },
    });

    //assert
    expect(result.statusCode).toBe(201);
  });

  it('should return 201 when creating transaction successfully (investment)', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: TransactionEnum.INVESTMENT,
      },
    });

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

  it('should return 400 when missing type', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: undefined,
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when missing amount', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        amount: undefined,
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when date is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: 'invalid_date',
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: 'invalid_type',
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when amount is not a valid currency', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        amount: 'invalid_amount',
      } as any,
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 500 when CreateTransactionUseCase throws', async () => {
    //arrange
    const { createTransactionUseCase, sut } = makeSut();
    jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should call CreateTransactionUseCase with correct params', async () => {
    //arrange
    const { createTransactionUseCase, sut } = makeSut();
    const executeSpy = jest.spyOn(createTransactionUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
