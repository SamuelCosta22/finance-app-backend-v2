import { RefreshTokenController } from '../../../../src/controllers/users/refresh-token.controller.ts';
import { makeRefreshTokenController } from '../../../../src/factories/controllers/users/make-refresh-token.controller.ts';

describe('Make Refresh Token Factory', () => {
  it('should return a valid RefreshTokenControllerInstance', () => {
    expect(makeRefreshTokenController()).toBeInstanceOf(RefreshTokenController);
  });
});
