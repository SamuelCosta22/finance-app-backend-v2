import { DeleteUserController } from '../../../controllers/users/delete-user.controller.ts';
import { PostgresDeleteUserRepository } from '../../../repositories/postgres/users/delete-user.repository.ts';
import { DeleteUserUseCase } from '../../../usecases/users/delete-user.usecase.ts';

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  return deleteUserController;
};
