import { DeleteTransactionController } from '../../../controllers/transactions/delete-transaction.controller.ts';
import { PostgresDeleteTransactionRepository } from '../../../repositories/postgres/transactions/delete-transaction.repository.ts';
import { PostgresGetTransactionByIdRepository } from '../../../repositories/postgres/transactions/get-transaction-by-id.repository.ts';
import { DeleteTransactionUseCase } from '../../../usecases/transactions/delete-transaction.usecase.ts';

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const getTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository();
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
    getTransactionByIdRepository,
  );
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  );

  return deleteTransactionController;
};
