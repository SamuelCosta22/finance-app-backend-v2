import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdUseCase } from '../../../src/usecases/transactions/get-transactions-by-user-id.usecase.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';

interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const user = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 7,
  }),
};

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
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId);

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId);
  });
});
