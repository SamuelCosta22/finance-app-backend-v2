import { IdGeneratorAdapter } from '../../../adapters/id-generator.ts';
import { CreateTransactionController } from '../../../controllers/transactions/create-transaction.controller.ts';
import { PostgresCreateTransactionRepository } from '../../../repositories/postgres/transactions/create-transaction.repository.ts';
import { PostgresGetUserByIdRepository } from '../../../repositories/postgres/users/get-user-by-id.repository.ts';
import { CreateTransactionUseCase } from '../../../usecases/transactions/create-transaction.usecase.ts';

export const makeCreateTransactionController = () => {
  const postgresCreateTransactionRepository =
    new PostgresCreateTransactionRepository();

  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();

  const createTransactionUseCase = new CreateTransactionUseCase(
    postgresCreateTransactionRepository,
    getUserByIdRepository,
    idGeneratorAdapter,
  );

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  );

  return createTransactionController;
};
