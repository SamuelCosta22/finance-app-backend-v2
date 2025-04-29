import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from '../../../src/usecases/users/delete-user.usecase.ts';

const user = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 7,
  }),
};

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
});
