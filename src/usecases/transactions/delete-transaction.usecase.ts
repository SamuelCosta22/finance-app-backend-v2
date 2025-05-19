import { TransactionNotFoundError } from '../../errors/transaction.ts';
import { ForbiddenError } from '../../errors/user.ts';
import {
  IDeleteTransactionRepository,
  IGetTransactionByIdRepository,
} from '../../types/repositories/transactions.repository.ts';

export class DeleteTransactionUseCase {
  constructor(
    private deleteTransactionRepository: IDeleteTransactionRepository,
    private getTransactionByIdRepository: IGetTransactionByIdRepository,
  ) {
    this.deleteTransactionRepository = deleteTransactionRepository;
    this.getTransactionByIdRepository = getTransactionByIdRepository;
  }
  async execute(transactionId: string, userId: string) {
    const transaction =
      await this.getTransactionByIdRepository.execute(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundError(transactionId);
    }

    if (transaction.user_id !== userId) {
      throw new ForbiddenError();
    }

    const deletedTransaction =
      await this.deleteTransactionRepository.execute(transactionId);

    return deletedTransaction;
  }
}
