import { CreateUserController } from '../../../../src/controllers/users/create-user.controller.ts';
import { makeCreateUserController } from '../../../../src/factories/controllers/users/make-create-user.controller.ts';

describe('Make Create User Factory', () => {
  it('should return a valid CreateUserControllerInstance', () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
  });
});
