import { prisma } from '../../../lib/prisma.ts';
import { CreateUserParams } from '../../../types/users/CreateUserParams.ts';

export class PostgresUpdateUserRepository {
  async execute(userId: string, input: CreateUserParams) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: input,
    });
  }
}
