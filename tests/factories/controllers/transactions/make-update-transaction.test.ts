import { UpdateTransactionController } from '../../../../src/controllers/transactions/update-transaction.controller.ts';
import { makeUpdateTransactionController } from '../../../../src/factories/controllers/transactions/make-update-transaction.controller.ts';

describe('Make Update Transaction Controller', () => {
  it('should return a valid UpdateTransactionControllerInstance', async () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    );
  });
});
