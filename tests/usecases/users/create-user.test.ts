import { faker } from '@faker-js/faker';
import { CreateUserUseCase } from '../../../src/usecases/users/create-user.usecase.ts';

class GetUserByEmailRepositoryStub {
  async execute() {
    return null;
  }
}

class CreateUserRepositoryStub {
  async execute(user: any) {
    return user;
  }
}

class PasswordHashedAdapterStub {
  async execute() {
    return 'hashed_password';
  }
}

class IdGeneratorAdapterStub {
  execute() {
    return 'generated_id';
  }
}

describe('Create User Use Case', () => {
  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHashedAdapter = new PasswordHashedAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHashedAdapter,
      idGeneratorAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHashedAdapter,
      idGeneratorAdapter,
    };
  };

  it('should successfully create a user', async () => {
    //arrange
    const { sut } = makeSut();
    //act
    const createdUser = await sut.execute({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    });

    //assert
    expect(createdUser).toBeTruthy();
  });
});
