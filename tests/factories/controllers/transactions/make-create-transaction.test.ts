import { CreateTransactionController } from '../../../../src/controllers/transactions/create-transaction.controller.ts';
import { makeCreateTransactionController } from '../../../../src/factories/controllers/transactions/make-create-transaction.controller.ts';

describe('Make Create Transaction Controller', () => {
  it('should return a valid CreateTransactionControllerInstance', async () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    );
  });
});
