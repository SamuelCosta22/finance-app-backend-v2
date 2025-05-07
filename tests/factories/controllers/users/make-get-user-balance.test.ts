import { GetUserBalanceController } from '../../../../src/controllers/users/get-user-balance.controller.ts';
import { makeGetUserBalanceController } from '../../../../src/factories/controllers/users/make-get-user-balance.controller.ts';

describe('Make Get User Balance Controller', () => {
  it('should return a valid GetUserBalanceControllerInstance', async () => {
    expect(makeGetUserBalanceController()).toBeInstanceOf(
      GetUserBalanceController,
    );
  });
});
