import { GetTransactionsByUserIdController } from '../../../../src/controllers/transactions/get-transactions-by-user-id.controller.ts';
import { makeGetTransactionsByUserIdController } from '../../../../src/factories/controllers/transactions/make-get-transactions-by-user-id.controller.ts';

describe('Make Get Transactions By User Id Controller', () => {
  it('should return a valid GetTransactionsByUserIdControllerInstance', async () => {
    expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
      GetTransactionsByUserIdController,
    );
  });
});
