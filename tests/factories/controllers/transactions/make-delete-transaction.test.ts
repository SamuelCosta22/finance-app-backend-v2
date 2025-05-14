import { DeleteTransactionController } from '../../../../src/controllers/transactions/delete-transaction.controller.ts';
import { makeDeleteTransactionController } from '../../../../src/factories/controllers/transactions/make-delete-transaction.controller.ts';

describe('Make Delete Transaction Factory', () => {
  it('should return a valid DeleteTransactionControllerInstance', () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(
      DeleteTransactionController,
    );
  });
});
