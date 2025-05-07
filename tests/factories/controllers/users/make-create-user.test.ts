import { CreateUserController } from '../../../../src/controllers/users/create-user.controller.ts';
import { makeCreateUserController } from '../../../../src/factories/controllers/users/make-create-user.controller.ts';

describe('Make Create User Controller', () => {
  it('should return a valid CreateUserControllerInstance', async () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
  });
});
