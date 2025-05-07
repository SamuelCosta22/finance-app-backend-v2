import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../lib/prisma.ts';
import { UserNotFoundError } from '../../../errors/user.ts';

export class PostgresDeleteUserRepository {
  async execute(userId: string) {
    try {
      return await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        //P2025 - "An operation failed because it depends on one or more records that were required but could not be found."
        if (error.code === 'P2025') {
          throw new UserNotFoundError(userId);
        }
      }
      console.error(error);
      throw error;
    }
  }
}
