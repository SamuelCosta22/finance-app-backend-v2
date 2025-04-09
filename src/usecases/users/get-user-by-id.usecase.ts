import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';

export class GetUserByIdUseCase {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(userId: string) {
    const user = this.getUserByIdRepository.execute(userId);

    return user;
  }
}
