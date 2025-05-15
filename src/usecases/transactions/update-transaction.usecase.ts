import { TransactionNotFoundError } from '../../errors/transaction.ts';
import { ForbiddenError } from '../../errors/user.ts';
import {
  IGetTransactionByIdRepository,
  IUpdateTransactionRepository,
} from '../../types/repositories/transactions.repository.ts';
import { UpdateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';

export class UpdateTransactionUseCase {
  constructor(
    private updateTransactionRepository: IUpdateTransactionRepository,
    private getTransactionByIdRepository: IGetTransactionByIdRepository,
  ) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getTransactionByIdRepository = getTransactionByIdRepository;
  }

  async execute(transactionId: string, params: UpdateTransactionsParams) {
    const transaction =
      await this.getTransactionByIdRepository.execute(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundError(transactionId);
    }

    if (params?.user_id && transaction.user_id !== params.user_id) {
      throw new ForbiddenError();
    }

    return await this.updateTransactionRepository.execute(
      transactionId,
      params,
    );
  }
}
