import { GetTransactionsByUserIdController } from '../../../controllers/transactions/get-transactions-by-user-id.controller.ts';
import { PostgresGetTransactionsByUserIdRepository } from '../../../repositories/postgres/transactions/get-transactions-by-user-id.repository.ts';
import { PostgresGetUserByIdRepository } from '../../../repositories/postgres/users/get-user-by-id.repository.ts';
import { GetTransactionsByUserIdUseCase } from '../../../usecases/transactions/get-transactions-by-user-id.usecase.ts';

export const makeGetTransactionsByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserIdRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionsByUserIdRepository,
    getUserByIdRepository,
  );

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

  return getTransactionsByUserIdController;
};
