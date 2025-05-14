import {
  InvalidPasswordError,
  UserNotFoundError,
} from '../../../src/errors/user.ts';
import { LoginUserUseCase } from '../../../src/usecases/users/login-user.usecase.ts';
import { user, UserEntity } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

class GetUserByEmailRepositoryStub {
  execute(): Promise<UserEntity | null> {
    return Promise.resolve(user);
  }
}

class PasswordComparatorAdapterStub {
  execute(): Promise<boolean> {
    return Promise.resolve(true);
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

describe('Login User Use Case', () => {
  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapter = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
    const sut = new LoginUserUseCase(
      getUserByEmailRepository,
      passwordComparatorAdapter,
      tokensGeneratorAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      passwordComparatorAdapter,
      tokensGeneratorAdapter,
    };
  };

  it('should throw UserNotFounError if user is not found', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(null);

    //act
    const promise = sut.execute({
      email: 'any_email',
      password: 'any_password',
    });

    //assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('should throw InvalidPasswordError if password is not valid', async () => {
    //arrange
    const { sut, passwordComparatorAdapter } = makeSut();
    jest
      .spyOn(passwordComparatorAdapter, 'execute')
      .mockResolvedValueOnce(false);

    //act
    const promise = sut.execute({
      email: 'any_email',
      password: 'any_password',
    });

    //assert
    await expect(promise).rejects.toThrow(new InvalidPasswordError());
  });

  it('should return user with tokens', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      email: 'any_email',
      password: 'any_password',
    });

    //assert
    expect(result.tokens.accessToken).toBeDefined();
  });
});
