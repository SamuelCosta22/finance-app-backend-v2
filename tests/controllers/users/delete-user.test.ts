import { faker } from '@faker-js/faker';
import { DeleteUserController } from '../../../src/controllers/users/delete-user.controller.ts';
import { user } from '../../fixtures/user.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';

class DeleteUserUseCaseStub {
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

describe('Delete User Controller', () => {
  const makeSut = () => {
    const deleteUserUseCase = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteUserUseCase);

    return { deleteUserUseCase, sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it('should return 200 if user is deletd', async () => {
    //arange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if id is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if user not found', async () => {
    // arrange
    const { deleteUserUseCase, sut } = makeSut();
    jest
      .spyOn(deleteUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(httpRequest.params.userId));

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if DeleteUserUseCase throws', async () => {
    //arange
    const { deleteUserUseCase, sut } = makeSut();
    jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should call DeleteUserUseCase with correct params', async () => {
    //arrange
    const { deleteUserUseCase, sut } = makeSut();
    const executeSpy = jest.spyOn(deleteUserUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});
