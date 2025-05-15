import { UpdateTransactionController } from '../../../controllers/transactions/update-transaction.controller.ts';
import { PostgresGetTransactionByIdRepository } from '../../../repositories/postgres/transactions/get-transaction-by-id.repository.ts';
import { PostgresUpdateTransactionRepository } from '../../../repositories/postgres/transactions/update-transaction.repository.ts';
import { UpdateTransactionUseCase } from '../../../usecases/transactions/update-transaction.usecase.ts';

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository();
  const getTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository();
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
    getTransactionByIdRepository,
  );
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  );

  return updateTransactionController;
};
