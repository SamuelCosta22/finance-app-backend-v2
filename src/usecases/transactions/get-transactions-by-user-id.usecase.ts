import { UserNotFoundError } from '../../errors/user.ts';
import { IGetTransactionsByUserIdRepository } from '../../types/repositories/transactions.repository.ts';
import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';

export class GetTransactionsByUserIdUseCase {
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(user_id: string) {
    const user = await this.getUserByIdRepository.execute(user_id);
    if (!user) throw new UserNotFoundError(user_id);

    const transactions =
      await this.getTransactionsByUserIdRepository.execute(user_id);

    return transactions;
  }
}
