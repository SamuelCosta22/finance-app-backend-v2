import {
  IGetUserBalanceRepository,
  IGetUserByIdRepository,
} from '../../types/repositories/users.repository.ts';

export class GetUserBalanceUseCase {
  constructor(
    private getUserBalanceRepository: IGetUserBalanceRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getUserBalanceRepository = getUserBalanceRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params: any) {
    const user = await this.getUserByIdRepository.execute(params.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const balance = await this.getUserBalanceRepository.execute(params.userId);

    return balance;
  }
}
