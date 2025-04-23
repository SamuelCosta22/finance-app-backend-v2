import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from '../../../src/controllers/users/get-user-balance.controller.ts';

class GetUserBalanceUserUseCaseStub {
  async execute() {
    return faker.number.int();
  }
}

describe('Get User Balance Controller', () => {
  const makeSut = () => {
    //Switch Under Test
    const getUserBalanceUseCase = new GetUserBalanceUserUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCase);

    return { getUserBalanceUseCase, sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it('should return 200 when getting user balance', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const httpResponse = await sut.execute(httpRequest);

    //assert
    expect(httpResponse.statusCode).toBe(200);
  });
});
