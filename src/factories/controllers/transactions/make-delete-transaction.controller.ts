import { DeleteTransactionController } from '../../../controllers/transactions/delete-transaction.controller.ts';
import { PostgresDeleteTransactionRepository } from '../../../repositories/postgres/transactions/delete-transaction.repository.ts';
import { DeleteTransactionUseCase } from '../../../usecases/transactions/delete-transaction.usecase.ts';

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  );

  return deleteTransactionController;
};
