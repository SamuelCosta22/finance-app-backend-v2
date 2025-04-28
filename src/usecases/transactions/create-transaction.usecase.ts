import { UserNotFoundError } from '../../errors/user.ts';
import { CreateTransactionsParams } from '../../types/transactions/CreateTransactionParams.ts';
import { ICreateTransactionRepository } from '../../types/repositories/transactions.repository.ts';
import { IGetUserByIdRepository } from '../../types/repositories/users.repository.ts';
import { IIdGeneratorAdapter } from '../../adapters/id-generator.ts';

export class CreateTransactionUseCase {
  constructor(
    private createTransactionRepository: ICreateTransactionRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private idGeneratorAdapter: IIdGeneratorAdapter,
  ) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(params: CreateTransactionsParams) {
    const userId = params.user_id;
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = this.idGeneratorAdapter.execute();

    const transaction = await this.createTransactionRepository.execute({
      ...params,
      id: transactionId,
    });

    return transaction;
  }
}
