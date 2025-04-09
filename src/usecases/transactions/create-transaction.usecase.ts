import { v4 as uuidv4 } from 'uuid';
import { UserNotFoundError } from '../../errors/user.ts';
import { CreateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';
import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';

export class CreateTransactionUseCase {
  constructor(
    private createTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params: CreateTransactionsParams) {
    const userId = params.user_id;
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = uuidv4();

    const transaction = await this.createTransactionRepository.execute({
      ...params,
      id: transactionId,
    });

    return transaction;
  }
}
