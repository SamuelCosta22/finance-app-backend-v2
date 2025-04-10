import { UpdateTransactionController } from '../../../controllers/transactions/update-transaction.controller.ts';
import { PostgresUpdateTransactionRepository } from '../../../repositories/postgres/transactions/update-transaction.repository.ts';
import { UpdateTransactionUseCase } from '../../../usecases/transactions/update-transaction.usecase.ts';

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  );

  return updateTransactionController;
};
