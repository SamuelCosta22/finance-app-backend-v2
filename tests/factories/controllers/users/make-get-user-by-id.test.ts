import { GetUserByIdController } from '../../../../src/controllers/users/get-user-by-id.controller.ts';
import { makeGetUserByIdController } from '../../../../src/factories/controllers/users/make-get-user-by-id.controller.ts';

describe('Make Get User By Id Factory', () => {
  it('should return a valid GetUserByIdControllerInstance', () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController);
  });
});
