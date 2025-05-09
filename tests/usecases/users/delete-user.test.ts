import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from '../../../src/usecases/users/delete-user.usecase.ts';
import { user } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class DeleteUserRepositoryUseCaseStub {
  async execute() {
    return user;
  }
}

describe('Delete User Use Case', () => {
  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryUseCaseStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);

    return { deleteUserRepository, sut };
  };

  it('should successfully delete a user', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const deletedUser = await sut.execute(faker.string.uuid());

    //assert
    expect(deletedUser).toEqual(user);
  });

  it('should call DeleteUserRepository with correct params', async () => {
    //arrange
    const { deleteUserRepository, sut } = makeSut();
    const executeSpy = jest.spyOn(deleteUserRepository, 'execute');
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it('should throw if DeleteUserRepository throws', async () => {
    //arrange
    const { deleteUserRepository, sut } = makeSut();
    jest
      .spyOn(deleteUserRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(faker.string.uuid());

    //assert
    await expect(promise).rejects.toThrow();
  });
});
