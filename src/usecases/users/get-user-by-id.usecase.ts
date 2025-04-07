import { PostgresGetUserByIdRepository } from '../../repositories/postgres/users/get-user-by-id.repository.ts';

export class GetUserByIdUseCase {
  async execute(userId: string) {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const user = getUserByIdRepository.execute(userId);

    return user;
  }
}
