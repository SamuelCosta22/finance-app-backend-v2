import { DeleteTransactionController } from '../../../../src/controllers/transactions/delete-transaction.controller.ts';
import { makeDeleteTransactionController } from '../../../../src/factories/controllers/transactions/make-delete-transaction.controller.ts';

describe('Make Delete Transaction Controller', () => {
  it('should return a valid DeleteTransactionControllerInstance', async () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(
      DeleteTransactionController,
    );
  });
});
