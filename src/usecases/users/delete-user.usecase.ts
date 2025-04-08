import { PostgresDeleteUserRepository } from '../../repositories/postgres/users/delete-user.repository.ts';

export class DeleteUserUseCase {
  async execute(userId: string) {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository();
    const deletedUser = postgresDeleteUserRepository.execute(userId);

    return deletedUser;
  }
}
