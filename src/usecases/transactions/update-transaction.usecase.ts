import { UserNotFoundError } from '../../errors/user.ts';
import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';
import { CreateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';

export class UpdateTransactionUseCase {
  constructor(
    private updateTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params: CreateTransactionsParams) {
    const user = await this.getUserByIdRepository.execute(params.user_id);
    if (!user) throw new UserNotFoundError(params.user_id);

    const transaction = await this.updateTransactionRepository.execute(params);

    return transaction;
  }
}
