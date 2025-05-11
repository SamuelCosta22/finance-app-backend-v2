import { UserNotFoundError } from '../../../errors/user.ts';
import { prisma } from '../../../lib/prisma.ts';
import { UpdateUserParams } from '../../../types/users/CreateUserParams.ts';

export class PostgresUpdateUserRepository {
  async execute(userId: string, input: UpdateUserParams) {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: input,
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundError(userId);
      }
      console.error(error);
      throw error;
    }
  }
}
