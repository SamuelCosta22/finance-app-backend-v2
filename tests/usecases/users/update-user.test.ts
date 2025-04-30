import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from '../../../src/usecases/users/update-user.usecase.ts';

// interface UserEntity {
//   id: string;
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   password?: string;
// }

const user = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 7,
  }),
};

// class GetUserByEmailRepositoryStub {
//   async execute(): Promise<UserEntity | null> {
//     return null;
//   }
// }

class UpdateUserRepositoryStub {
  async execute() {
    return user;
  }
}

class PasswordHashedAdapterStub {
  async execute(): Promise<string> {
    return 'hashed_password';
  }
}

describe('Get User By Id Use Case', () => {
  const makeSut = () => {
    //const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const updateUserRepository = new UpdateUserRepositoryStub();
    const passwordHashedAdapter = new PasswordHashedAdapterStub();
    const sut = new UpdateUserUseCase(
      //getUserByEmailRepository,
      updateUserRepository,
      passwordHashedAdapter,
    );
    return {
      //getUserByEmailRepository,
      updateUserRepository,
      passwordHashedAdapter,
      sut,
    };
  };

  it('should update a user successfully (without email or password)', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    });

    //assert
    expect(result).toBe(user);
  });

  it('should update user successfully (with email)', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(faker.string.uuid(), {
      email: faker.internet.email(),
    });

    //assert
    expect(result).toBe(user);
  });
});
