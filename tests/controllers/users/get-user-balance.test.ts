import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from '../../../src/controllers/users/get-user-balance.controller.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';

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

  it('should return 400 when userId is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 500 if GetUserBalanceUseCase throws', async () => {
    //arrange
    const { getUserBalanceUseCase, sut } = makeSut();
    jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should call GetUserBalanceUseCase with correct params', async () => {
    //arrange
    const { getUserBalanceUseCase, sut } = makeSut();
    const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
    //arrange
    const { getUserBalanceUseCase, sut } = makeSut();
    jest
      .spyOn(getUserBalanceUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.params.userId));

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(404);
  });
});
