import { PasswordHasherAdapter } from '../../../adapters/password-hasher.ts';
import { UpdateUserController } from '../../../controllers/users/update-user.controller.ts';
import { PostgresGetUserByEmailRepository } from '../../../repositories/postgres/users/get-user-by-email.repository.ts';
import { PostgresUpdateUserRepository } from '../../../repositories/postgres/users/update-user.repository.ts';
import { UpdateUserUseCase } from '../../../usecases/users/update-user.usecase.ts';

export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    passwordHasherAdapter,
    getUserByEmailRepository,
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);

  return updateUserController;
};
