import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdUseCase } from '../../../src/usecases/transactions/get-transactions-by-user-id.usecase.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';
import { user, UserEntity } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class GetTransactionsByUserIdRepositoryStub {
  async execute(): Promise<[]> {
    return [];
  }
}

class GetUserByIdRepositoryStub {
  async execute(): Promise<UserEntity | null> {
    return user;
  }
}

describe('Get Transactions By User Id Use Case', () => {
  const makeSut = () => {
    const getTransactionsByUserIdRepository =
      new GetTransactionsByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionsByUserIdRepository,
      getUserByIdRepository,
    );

    return { getTransactionsByUserIdRepository, getUserByIdRepository, sut };
  };

  it('should successfully get transactions by user id', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(faker.string.uuid());

    //assert
    expect(result).toEqual([]);
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null);
    const userId = faker.string.uuid();

    //act
    const promise = sut.execute(userId);

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepository,
      'execute',
    );
    const id = faker.string.uuid();

    //act
    await sut.execute(id);

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(id);
  });

  it('should call GetTransactionsByUserIdRepository with correct params', async () => {
    //arrange
    const { getTransactionsByUserIdRepository, sut } = makeSut();
    const getTransactionsByUserIdRepositorySpy = jest.spyOn(
      getTransactionsByUserIdRepository,
      'execute',
    );
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId);

    //assert
    expect(getTransactionsByUserIdRepositorySpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error());

    //act
    const promise = sut.execute(faker.string.uuid());

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetTransactionsByUserIdRepository throws', async () => {
    //arrange
    const { getTransactionsByUserIdRepository, sut } = makeSut();
    jest
      .spyOn(getTransactionsByUserIdRepository, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(faker.string.uuid());

    //assert
    await expect(promise).rejects.toThrow();
  });
});
