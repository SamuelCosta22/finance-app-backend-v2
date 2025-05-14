import { PasswordComparatorAdapter } from '../../../adapters/password-comparator.ts';
import { TokensGeneratorAdapter } from '../../../adapters/tokens-generator.ts';
import { LoginUserController } from '../../../controllers/users/login-user.controller.ts';
import { PostgresGetUserByEmailRepository } from '../../../repositories/postgres/users/get-user-by-email.repository.ts';
import { LoginUserUseCase } from '../../../usecases/users/login-user.usecase.ts';

export const makeLoginUserController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordComparatorAdapter = new PasswordComparatorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const loginUserUseCase = new LoginUserUseCase(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  );
  const loginUserController = new LoginUserController(loginUserUseCase);

  return loginUserController;
};
