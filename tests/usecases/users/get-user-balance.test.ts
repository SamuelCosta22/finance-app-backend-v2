import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from '../../../src/usecases/users/get-user-balance.usecase.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';

const userBalance = {
  earnings: faker.finance.amount(),
  expenses: faker.finance.amount(),
  investments: faker.finance.amount(),
  balance: faker.finance.amount(),
};

class GetUserByIdRepositoryStub {
  async execute(): Promise<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  } | null> {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    };
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

  it('should get user balance successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(faker.string.uuid());

    //assert
    expect(result).toEqual(userBalance);
  });

  it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null);
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
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId);

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId);
  });
});
