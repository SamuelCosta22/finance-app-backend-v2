import { IHashGeneratorAdapter } from '../../adapters/password-hasher.ts';
import { EmailAlreadyInUseError } from '../../errors/user.ts';
import {
  IGetUserByEmailRepository,
  IUpdateUserRepository,
} from '../../types/repositories/users.repository.ts';
import { UpdateUserParams } from '../../types/users/CreateUserParams.ts';

export class UpdateUserUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private updateUserRepository: IUpdateUserRepository,
    private passwordHasherAdapter: IHashGeneratorAdapter,
  ) {
    this.updateUserRepository = updateUserRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
  }

  async execute(userId: string, input: UpdateUserParams) {
    if (input.email) {
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
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
