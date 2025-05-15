import { RefreshTokenController } from '../../../src/controllers/users/refresh-token.controller.ts';
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
    return { userId: 'any_user_id' };
  }
}

describe('Refresh Token Controller', () => {
  const makeSut = () => {
    const tokenGeneratorAdapterStub = new TokenGeneratorAdapterStub();
    const tokenVerifierAdapterStub = new TokenVerifierAdapterStub();

    const refreshTokenUseCase = new RefreshTokenUseCase(
      tokenGeneratorAdapterStub,
      tokenVerifierAdapterStub,
    );
    const sut = new RefreshTokenController(refreshTokenUseCase);
    return {
      sut,
      refreshTokenUseCase,
      tokenGeneratorAdapterStub,
      tokenVerifierAdapterStub,
    };
  };

  const httpRequest = {
    body: {
      refreshToken: 'any_refresh_token',
    },
  };

  it('should return 400 if refreshToken is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({ body: {} });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 200 if refreshToken is valid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 401 if RefreshTokenUseCase throws UnauthorizedError', async () => {
    //arrange
    const { sut, refreshTokenUseCase } = makeSut();
    jest.spyOn(refreshTokenUseCase, 'execute').mockImplementationOnce(() => {
      throw new UnauthorizedError();
    });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(401);
  });
});
