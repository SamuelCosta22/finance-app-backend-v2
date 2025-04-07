import bcrypt from 'bcrypt';
import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { PostgresGetUserByEmailRepository } from '../../repositories/postgres/users/get-user-by-email.repository.ts';
import { PostgresUpdateUserRepository } from '../../repositories/postgres/users/update-user.repository.ts';
import { CreateUserParams } from '../../types/users/CreateUserParams.ts';

export class UpdateUserUseCase {
  async execute(userId: string, input: CreateUserParams) {
    if (input.email) {
      const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
      const userWithProvidedEmail = await getUserByEmailRepository.execute(
        input.email,
      );

      if (userWithProvidedEmail) {
        throw new EmailAlreadyInUseError(input.email);
      }
    }

    const user = { ...input };

    if (input.password) {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      user.password = hashedPassword;
    }

    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updatedUser = await postgresUpdateUserRepository.execute(
      userId,
      user,
    );

    return updatedUser;
  }
}
