import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from '../../../src/usecases/users/update-user.usecase.ts';
import { EmailAlreadyInUseError } from '../../../src/errors/user.ts';
import { user, UserEntity } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class GetUserByEmailRepositoryStub {
  async execute(): Promise<UserEntity | null> {
    return null;
  }
}

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
    const updateUserRepository = new UpdateUserRepositoryStub();
    const passwordHashedAdapter = new PasswordHashedAdapterStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();

    const sut = new UpdateUserUseCase(
      updateUserRepository,
      passwordHashedAdapter,
      getUserByEmailRepository,
    );
    return {
      //getUserByEmailRepository,
      updateUserRepository,
      passwordHashedAdapter,
      getUserByEmailRepository,
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
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailRepositorySpy = jest.spyOn(
      getUserByEmailRepository,
      'execute',
    );
    const email = faker.internet.email();

    //act
    const result = await sut.execute(faker.string.uuid(), {
      email,
    });

    //assert
    expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
    expect(result).toBe(user);
  });

  it('should update user successfully (with password)', async () => {
    //arrange
    const { sut, passwordHashedAdapter } = makeSut();
    const passwordHashedAdapterSpy = jest.spyOn(
      passwordHashedAdapter,
      'execute',
    );
    const password = faker.internet.password();

    //act
    const result = await sut.execute(faker.string.uuid(), {
      password,
    });

    //assert
    expect(passwordHashedAdapterSpy).toHaveBeenCalledWith(password);
    expect(result).toBe(user);
  });

  it('should throw EmailAlreadyInUseError if email is already in use', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user);

    //act
    const promise = sut.execute(faker.string.uuid(), {
      email: user.email,
    });

    //assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    );
  });

  it('should call UpdateUserRepository with correct params', async () => {
    //arrange
    const { updateUserRepository, sut } = makeSut();
    const updateUserRepositorySpy = jest.spyOn(updateUserRepository, 'execute');
    const userId = faker.string.uuid();
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    //act
    await sut.execute(userId, updateUserParams);

    //assert
    expect(updateUserRepositorySpy).toHaveBeenCalledWith(userId, {
      ...updateUserParams,
      password: 'hashed_password',
    });
  });

  it('should throw if GetUserByEmailRepository throws', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(faker.string.uuid(), {
      email: user.email,
    });

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if PasswordHashedAdapter throws', async () => {
    //arrange
    const { sut, passwordHashedAdapter } = makeSut();
    jest
      .spyOn(passwordHashedAdapter, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(faker.string.uuid(), {
      password: faker.internet.password(),
    });

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if UpdateUserRepository throws', async () => {
    //arrange
    const { sut, updateUserRepository } = makeSut();
    jest
      .spyOn(updateUserRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    //assert
    await expect(promise).rejects.toThrow();
  });
});
