import { CreateTransactionsParams } from '../transactions/CreateTransactionParams.ts';

export interface ICreateTransactionRepository {
  execute(
    params: CreateTransactionsParams,
    transactionId?: string,
  ): Promise<any>;
}

export interface IUpdateTransactionRepository {
  execute(
    transactionId: string,
    params: CreateTransactionsParams,
  ): Promise<any>;
}

export interface IGetTransactionsByUserIdRepository {
  execute(userId: string): Promise<any>;
}
