import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../../generated/prisma/client.js';
import { GetTransactionsByUserIdController } from '../../../src/controllers/transactions/get-transactions-by-user-id.controller.ts';
import { GetTransactionsByUserIdUseCase } from '../../../src/usecases/transactions/get-transactions-by-user-id.usecase.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';

class GetTransactionsByUserIdUseCaseStub {
  async execute(): Promise<{
    user_id: string;
    id: string;
    name: string;
    date: Date;
    type: TransactionEnum;
    amount: number;
  } | null> {
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
});
