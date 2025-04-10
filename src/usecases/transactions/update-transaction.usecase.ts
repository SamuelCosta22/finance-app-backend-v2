import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { CreateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';

export class UpdateTransactionUseCase {
  constructor(
    private updateTransactionRepository: ICreateTransactionRepository,
  ) {
    this.updateTransactionRepository = updateTransactionRepository;
  }

  async execute(transactionId: string, params: CreateTransactionsParams) {
    const transaction = await this.updateTransactionRepository.execute(
      transactionId,
      params,
    );

    return transaction;
  }
}
