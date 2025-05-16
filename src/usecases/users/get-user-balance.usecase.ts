import { UserNotFoundError } from '../../errors/user.ts';
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

  async execute(userId: string, from: Date, to: Date) {
    const user = await this.getUserByIdRepository.execute(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const balance = await this.getUserBalanceRepository.execute(
      userId,
      from,
      to,
    );

    return balance;
  }
}
