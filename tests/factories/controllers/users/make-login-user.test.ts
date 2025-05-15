import { LoginUserController } from '../../../../src/controllers/users/login-user.controller.ts';
import { makeLoginUserController } from '../../../../src/factories/controllers/users/make-login-user.controller.ts';

describe('Make Login User Factory', () => {
  it('should return a valid LoginUserControllerInstance', () => {
    expect(makeLoginUserController()).toBeInstanceOf(LoginUserController);
  });
});
