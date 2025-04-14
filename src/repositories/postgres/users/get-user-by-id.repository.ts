import { prisma } from '../../../lib/prisma.ts';
import { IGetUserByIdRepository } from '../../../types/repositories/users.repository.ts';

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
