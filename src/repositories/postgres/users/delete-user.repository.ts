import { UserNotFoundError } from '../../../errors/user.ts';
import { prisma } from '../../../lib/prisma.ts';

export class PostgresDeleteUserRepository {
  async execute(userId: string) {
    try {
      return await prisma.user.delete({
        where: {
          id: userId,
        },
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
