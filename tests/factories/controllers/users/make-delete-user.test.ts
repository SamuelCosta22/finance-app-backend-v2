import { DeleteUserController } from '../../../../src/controllers/users/delete-user.controller.ts';
import { makeDeleteUserController } from '../../../../src/factories/controllers/users/make-delete-user.controller.ts';

describe('Make Delete User Controller', () => {
  it('should return a valid DeleteUserControllerInstance', async () => {
    expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController);
  });
});
