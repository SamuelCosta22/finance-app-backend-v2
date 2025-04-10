import { IDeleteTransactionRepository } from '../../types/repositories/transactions.repository.ts';

export class DeleteTransactionUseCase {
  constructor(
    private deleteTransactionRepository: IDeleteTransactionRepository,
  ) {
    this.deleteTransactionRepository = deleteTransactionRepository;
  }
  async execute(transactionId: string) {
    const transaction =
      await this.deleteTransactionRepository.execute(transactionId);

    return transaction;
  }
}
