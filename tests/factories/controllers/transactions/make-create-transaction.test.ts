import { CreateTransactionController } from '../../../../src/controllers/transactions/create-transaction.controller.ts';
import { makeCreateTransactionController } from '../../../../src/factories/controllers/transactions/make-create-transaction.controller.ts';

describe('Make Create Transaction Factory', () => {
  it('should return a valid CreateTransactionControllerInstance', () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    );
  });
});
