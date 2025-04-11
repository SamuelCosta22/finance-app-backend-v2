import { GetUserBalanceController } from '../../../controllers/users/get-user-balance.controller.ts';
import { PostgresGetUserBalanceRepository } from '../../../repositories/postgres/users/get-user-balance.repository.ts';
import { PostgresGetUserByIdRepository } from '../../../repositories/postgres/users/get-user-by-id.repository.ts';
import { GetUserBalanceUseCase } from '../../../usecases/users/get-user-balance.usecase.ts';

export const makeGetUserBalanceController = () => {
  const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    getUserBalanceRepository,
    getUserByIdRepository,
  );
  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase,
  );

  return getUserBalanceController;
};
