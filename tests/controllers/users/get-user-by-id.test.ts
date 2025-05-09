import { faker } from '@faker-js/faker';
import { GetUserByIdController } from '../../../src/controllers/users/get-user-by-id.controller.ts';
import { user } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class GetUserByIdUseCaseStub {
  async execute(): Promise<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  } | null> {
    return user;
  }
}

describe('Get User By Id Controller', () => {
  const makeSut = () => {
    //Switch Under Test
    const getUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return { getUserByIdUseCase, sut };
  };

  const httpRequest = {
    params: { userId: faker.string.uuid() },
  };

  it('should return 200 if a user is found', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if invalid id is provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if a user is not found', async () => {
    //assert
    const { getUserByIdUseCase, sut } = makeSut();
    jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValueOnce(null);

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if GetUserByIdUseCase throws', async () => {
    //arange
    const { getUserByIdUseCase, sut } = makeSut();
    jest
      .spyOn(getUserByIdUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should call GetUserByIdUseCase with correct params', async () => {
    //arrange
    const { getUserByIdUseCase, sut } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});
