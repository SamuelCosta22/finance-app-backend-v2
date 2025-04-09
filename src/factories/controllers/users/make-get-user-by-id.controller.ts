import { GetUserByIdController } from '../../../controllers/users/get-user-by-id.controller.ts';
import { PostgresGetUserByIdRepository } from '../../../repositories/postgres/users/get-user-by-id.repository.ts';
import { GetUserByIdUseCase } from '../../../usecases/users/get-user-by-id.usecase.ts';

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  return getUserByIdController;
};
