import { faker } from '@faker-js/faker';
import { CreateUserUseCase } from '../../../src/usecases/users/create-user.usecase.ts';
import { EmailAlreadyInUseError } from '../../../src/errors/user.ts';
import { CreateUserParams } from '../../../src/types/users/CreateUserParams.ts';

interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

class GetUserByEmailRepositoryStub {
  async execute(): Promise<UserEntity | null> {
    return null;
  }
}

class CreateUserRepositoryStub {
  async execute(createUserParams: CreateUserParams): Promise<UserEntity> {
    return {
      id: 'generated_id',
      first_name: createUserParams.first_name,
      last_name: createUserParams.last_name,
      email: createUserParams.email,
      password: 'hashed_password',
    };
  }
}

class PasswordHashedAdapterStub {
  async execute(): Promise<string> {
    return 'hashed_password';
  }
}

class IdGeneratorAdapterStub {
  execute(): string {
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
      createUserRepository,
      getUserByEmailRepository,
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

  const user = {
    id: 'some_id',
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  };

  it('should successfully create a user', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const createdUser = await sut.execute(user);

    //assert
    expect(createdUser).toBeTruthy();
    expect(createdUser).toEqual({
      ...user,
      id: 'generated_id',
      password: 'hashed_password',
    });
  });

  it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(user);

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    );
  });

  it('should call IdGeneratorAdapter to generate a random id', async () => {
    //arrange
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute');
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute');

    //act
    await sut.execute(user);

    //assert
    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  it('should call PasswordHashedAdapter to cryptograph password', async () => {
    //arrange
    const { sut, createUserRepository, passwordHashedAdapter } = makeSut();
    const passwordHashedSpy = jest.spyOn(passwordHashedAdapter, 'execute');
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute');

    //act
    await sut.execute(user);

    //assert
    expect(passwordHashedSpy).toHaveBeenCalledWith(user.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  it('should throw if GetUserByEmailRepository throws', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if IdGeneratorAdapter throws', async () => {
    //arrange
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
