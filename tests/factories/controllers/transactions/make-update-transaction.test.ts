import { UpdateTransactionController } from '../../../../src/controllers/transactions/update-transaction.controller.ts';
import { makeUpdateTransactionController } from '../../../../src/factories/controllers/transactions/make-update-transaction.controller.ts';

describe('Make Update Transaction Factory', () => {
  it('should return a valid UpdateTransactionControllerInstance', () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    );
  });
});
