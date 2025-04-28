import { IdGeneratorAdapter } from '../../../adapters/id-generator.ts';
import { PasswordHasherAdapter } from '../../../adapters/password-hasher.ts';
import { CreateUserController } from '../../../controllers/users/create-user.controller.ts';
import { PostgresCreateUserRepository } from '../../../repositories/postgres/users/create-user.repository.ts';
import { PostgresGetUserByEmailRepository } from '../../../repositories/postgres/users/get-user-by-email.repository.ts';
import { CreateUserUseCase } from '../../../usecases/users/create-user.usecase.ts';

export const makeCreateUserController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const createUserRepository = new PostgresCreateUserRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  );
  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};
