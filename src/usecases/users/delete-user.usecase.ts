import { IDeleteUserRepository } from '../../repositories/postgres/users/delete-user.repository.ts';

export class DeleteUserUseCase {
  constructor(private deleteUserRepository: IDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository;
  }
  async execute(userId: string) {
    const deletedUser = this.deleteUserRepository.execute(userId);

    return deletedUser;
  }
}
