import { IUpdateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { UpdateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';

export class UpdateTransactionUseCase {
  constructor(
    private updateTransactionRepository: IUpdateTransactionRepository,
  ) {
    this.updateTransactionRepository = updateTransactionRepository;
  }

  async execute(transactionId: string, params: UpdateTransactionsParams) {
    const transaction = await this.updateTransactionRepository.execute(
      transactionId,
      params,
    );

    return transaction;
  }
}
