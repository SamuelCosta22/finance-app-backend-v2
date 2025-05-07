import { UpdateUserController } from '../../../../src/controllers/users/update-user.controller.ts';
import { makeUpdateUserController } from '../../../../src/factories/controllers/users/make-update-user.controller.ts';

describe('Make Update User Controller', () => {
  it('should return a valid UpdateUserControllerInstance', async () => {
    expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController);
  });
});
