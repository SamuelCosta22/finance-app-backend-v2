import { CreateTransactionsParams } from '../transactions/CreateTransactionParams.ts';

export interface ICreateTransactionRepository {
  execute(
    params: CreateTransactionsParams,
    transactionId?: string,
  ): Promise<any>;
}

export interface IGetTransactionsByUserIdRepository {
  execute(userId: string): Promise<any>;
}
