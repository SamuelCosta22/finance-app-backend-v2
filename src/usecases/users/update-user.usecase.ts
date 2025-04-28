import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { PostgresGetUserByEmailRepository } from '../../repositories/postgres/users/get-user-by-email.repository.ts';
import { CreateUserParams } from '../../types/users/CreateUserParams.ts';
import { IUpdateUserRepository } from '../../types/repositories/users.repository.ts';
import { IHashGeneratorAdapter } from '../../adapters/password-hasher.ts';

export class UpdateUserUseCase {
  constructor(
    private updateUserRepository: IUpdateUserRepository,
    private passwordHasherAdapter: IHashGeneratorAdapter,
  ) {
    this.updateUserRepository = updateUserRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
  }

  async execute(userId: string, input: CreateUserParams) {
    if (input.email) {
      const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
      const userWithProvidedEmail = await getUserByEmailRepository.execute(
        input.email,
      );

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(input.email);
      }
    }

    const user = { ...input };

    if (input.password) {
      const hashedPassword = await this.passwordHasherAdapter.execute(
        input.password,
      );
      user.password = hashedPassword;
    }

    const updatedUser = await this.updateUserRepository.execute(userId, user);

    return updatedUser;
  }
}
