import { EmailAlreadyInUseError } from '../../../src/errors/user.ts';
import { CreateUserParams } from '../../../src/types/users/CreateUserParams.ts';
import { CreateUserUseCase } from '../../../src/usecases/users/create-user.usecase.ts';
import { user, UserEntity } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class GetUserByEmailRepositoryStub {
  async execute(): Promise<UserEntity | null> {
    return null;
  }
}

class CreateUserRepositoryStub {
  async execute(createUserParams: CreateUserParams): Promise<UserEntity> {
    return {
      ...createUserParams,
      id: 'generated_id',
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

class TokensGeneratorAdapterStub {
  execute(): { accessToken: string; refreshToken: string } {
    return {
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token',
    };
  }
}

describe('Create User Use Case', () => {
  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHashedAdapter = new PasswordHashedAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const tokenGeneratorAdapter = new TokensGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHashedAdapter,
      idGeneratorAdapter,
      tokenGeneratorAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHashedAdapter,
      idGeneratorAdapter,
      tokenGeneratorAdapter,
    };
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
    expect(createdUser.tokens.accessToken).toBeDefined();
    expect(createdUser.tokens.accessToken).toBeDefined();
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

  it('should throw if PasswordHashedAdapter throws', async () => {
    //arrange
    const { sut, passwordHashedAdapter } = makeSut();
    jest
      .spyOn(passwordHashedAdapter, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if CreateUserRepository throws', async () => {
    //arrange
    const { sut, createUserRepository } = makeSut();
    jest
      .spyOn(createUserRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
