import { prisma } from '../../../lib/prisma.ts';
import { CreateUserParams } from '../../../types/users/CreateUserParams.ts';

export class PostgresCreateUserRepository {
  async execute(createUserParams: CreateUserParams) {
    const user = await prisma.user.create({
      data: {
        id: createUserParams.id,
        first_name: createUserParams.first_name,
        last_name: createUserParams.last_name,
        email: createUserParams.email,
        password: createUserParams.password,
      },
    });

    return user;
  }
}
