import { prisma } from '../../../lib/prisma.ts';

export class PostgresGetUserByEmailRepository {
  async execute(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
