import { UnauthorizedError } from '../../../src/errors/user.ts';
import { RefreshTokenUseCase } from '../../../src/usecases/users/refresh-token.usecase.ts';
import { jest } from '@jest/globals';

class TokenGeneratorAdapterStub {
  execute(): { accessToken: string; refreshToken: string } {
    return {
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token',
    };
  }
}

class TokenVerifierAdapterStub {
  execute() {
    return true;
  }
}

describe('Refresh Token Use Case', () => {
  const makeSut = () => {
    const tokenGeneratorAdapter = new TokenGeneratorAdapterStub();
    const tokenVerifierAdapter = new TokenVerifierAdapterStub();
    const sut = new RefreshTokenUseCase(
      tokenGeneratorAdapter,
      tokenVerifierAdapter,
    );

    return {
      sut,
      tokenGeneratorAdapter,
      tokenVerifierAdapter,
    };
  };

  it('should return a new tokens', async () => {
    //arrange
    const { sut } = makeSut();
    const refreshToken = 'any_refresh_token';

    //act
    const result = await sut.execute(refreshToken);

    //assert
    expect(result).toEqual({
      accessToken: 'any_access_token',
      refreshToken: 'any_refresh_token',
    });
  });

  it('should throw if TokenVerifierAdapter throws', async () => {
    //arrange
    const { sut, tokenVerifierAdapter } = makeSut();
    jest.spyOn(tokenVerifierAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const promise = sut.execute('any_refresh_token');

    //assert
    await expect(promise).rejects.toThrow(new UnauthorizedError());
  });
});
