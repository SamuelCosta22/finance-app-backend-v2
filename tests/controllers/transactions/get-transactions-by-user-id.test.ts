import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from '../../../src/controllers/transactions/get-transactions-by-user-id.controller.ts';
import { GetTransactionsByUserIdUseCase } from '../../../src/usecases/transactions/get-transactions-by-user-id.usecase.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';
import { TransactionEnum } from '@prisma/client';
import { transaction } from '../../fixtures/transaction.ts';

class GetTransactionsByUserIdUseCaseStub {
  async execute(): Promise<{
    user_id: string;
    id: string;
    name: string;
    date: Date;
    type: TransactionEnum;
    amount: number;
  } | null> {
    return transaction;
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
      query: { userId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 when missing userId param', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      query: { userId: undefined },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when provided userId is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      query: { userId: 'invalid_user_id' },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
    //arrange
    const { getTransactionsByUserIdUseCase, sut } = makeSut();
    jest
      .spyOn(getTransactionsByUserIdUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(faker.string.uuid()));

    //act
    const result = await sut.execute({
      query: { userId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 when GetTransactionsByUserIdUseCase throws', async () => {
    //arrange
    const { getTransactionsByUserIdUseCase, sut } = makeSut();
    jest
      .spyOn(getTransactionsByUserIdUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should call GetUserByUserIdUseCase with correct params', async () => {
    //arrange
    const { getTransactionsByUserIdUseCase, sut } = makeSut();
    const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, 'execute');
    const userId = faker.string.uuid();

    //act
    await sut.execute({ query: { userId } });

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
