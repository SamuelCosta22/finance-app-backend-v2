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
      console.error(error);
      return null;
    }
  }
}
