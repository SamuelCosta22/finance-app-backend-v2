import { prisma } from '../../../lib/prisma.ts';
import { UpdateUserParams } from '../../../types/users/CreateUserParams.ts';

export class PostgresUpdateUserRepository {
  async execute(userId: string, input: UpdateUserParams) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: input,
    });
  }
}
