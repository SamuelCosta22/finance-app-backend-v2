import { LoginUserController } from '../../../src/controllers/users/login-user.controller.ts';
import {
  InvalidPasswordError,
  UserNotFoundError,
} from '../../../src/errors/user.ts';
import { user, UserEntity } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

export type LoginResponse = UserEntity & {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

class LoginUserUseCaseStub {
  execute(): Promise<LoginResponse> {
    return Promise.resolve({
      ...user,
      tokens: {
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      },
    });
  }
}

describe('Login User Controller', () => {
  const makeSut = () => {
    const loginUserUseCase = new LoginUserUseCaseStub();
    const sut = new LoginUserController(loginUserUseCase);

    return {
      sut,
      loginUserUseCase,
    };
  };

  const httpRequest = {
    body: {
      email: 'a@gmail.com',
      password: '123456',
    },
  };

  it('should return 200 with user and tokens', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
    expect(result.body.tokens.accessToken).toBe('any_access_token');
    expect(result.body.tokens.refreshToken).toBe('any_refresh_token');
  });

  it('should return 401 if password is invalid', async () => {
    //arrange
    const { sut, loginUserUseCase } = makeSut();
    jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new InvalidPasswordError());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(401);
  });

  it('should return 404 if user is not found', async () => {
    //arrange
    const { sut, loginUserUseCase } = makeSut();
    jest
      .spyOn(loginUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError());

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(404);
  });
});
