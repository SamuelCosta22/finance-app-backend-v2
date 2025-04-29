import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from '../../../src/usecases/users/get-user-balance.usecase.ts';

const userBalance = {
  earnings: faker.finance.amount(),
  expenses: faker.finance.amount(),
  investments: faker.finance.amount(),
  balance: faker.finance.amount(),
};

class GetUserByIdRepositoryStub {
  async execute() {
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
});
