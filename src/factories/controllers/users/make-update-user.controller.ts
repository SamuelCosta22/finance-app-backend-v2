import { UpdateUserController } from '../../../controllers/users/update-user.controller.ts';
import { PostgresUpdateUserRepository } from '../../../repositories/postgres/users/update-user.repository.ts';
import { UpdateUserUseCase } from '../../../usecases/users/update-user.usecase.ts';

export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const updateUserUseCase = new UpdateUserUseCase(updateUserRepository);
  const updateUserController = new UpdateUserController(updateUserUseCase);

  return updateUserController;
};
