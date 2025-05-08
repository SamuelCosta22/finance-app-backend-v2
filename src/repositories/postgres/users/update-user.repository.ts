import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../lib/prisma.ts';
import { UpdateUserParams } from '../../../types/users/CreateUserParams.ts';
import { UserNotFoundError } from '../../../errors/user.ts';

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
      if (error instanceof PrismaClientKnownRequestError) {
        // P2025 - "An operation failed because it depends on one or more records that were required but could not be found."
        if (error.code === 'P2025') {
          throw new UserNotFoundError(userId);
        }
      }
      console.error(error);
      throw error;
    }
  }
}
