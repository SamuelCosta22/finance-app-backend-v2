import { userNotFoundResponse } from '../../controllers/users/helpers/invalid-response.ts';
import { IGetTransactionsByUserIdRepository } from '../../types/repositories/transactions.repository.ts';
import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';
import { CreateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';

export class PostgresGetTransactionsByUserIdUseCase {
  constructor(
    private getTransactionsByUserIdRepository: IGetTransactionsByUserIdRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params: CreateTransactionsParams) {
    const user = await this.getUserByIdRepository.execute(params.user_id);
    if (!user) return userNotFoundResponse();

    const transactions = await this.getTransactionsByUserIdRepository.execute(
      params.user_id,
    );

    return transactions;
  }
}
