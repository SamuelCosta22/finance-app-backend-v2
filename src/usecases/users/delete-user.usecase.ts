import { IDeleteUserRepository } from '../../types/repositories/users.repository.ts';

export class DeleteUserUseCase {
  constructor(private deleteUserRepository: IDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository;
  }
  async execute(userId: string) {
    const deletedUser = await this.deleteUserRepository.execute(userId);

    return deletedUser;
  }
}
