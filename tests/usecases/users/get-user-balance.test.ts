import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from '../../../src/usecases/users/get-user-balance.usecase.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';
import { user, userBalance } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class GetUserByIdRepositoryStub {
  async execute(): Promise<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  } | null> {
    return user;
  }
}

class GetUserBalanceRepositoryStub {
  async execute() {
    return userBalance;
  }
}

describe('Get User Balance Use Case', () => {
  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    );

    return { getUserBalanceRepository, getUserByIdRepository, sut };
  };

  const from = new Date('2023-01-01');
  const to = new Date('2023-01-31');

  it('should get user balance successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(faker.string.uuid(), from, to);

    //assert
    expect(result).toEqual(userBalance);
  });

  it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null);
    const userId = faker.string.uuid();

    //act
    const promise = sut.execute(userId, from, to);

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId, from, to);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should call GetUserBalanceRepository with correct params', async () => {
    //arrange
    const { getUserBalanceRepository, sut } = makeSut();
    const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute');
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId, from, to);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId, from, to);
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error());

    //act
    const promise = sut.execute(faker.string.uuid(), from, to);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if GetUserBalanceRepository throws', async () => {
    //arrange
    const { getUserBalanceRepository, sut } = makeSut();
    jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error());

    //act
    const promise = sut.execute(faker.string.uuid(), from, to);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
