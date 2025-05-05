import {
  CreateTransactionsParams,
  UpdateTransactionsParams,
} from '../transactions/CreateTransactionParams.ts';

export interface IGetTransactionsByUserIdRepository {
  execute(userId: string): Promise<any>;
}

export interface ICreateTransactionRepository {
  execute(
    params: CreateTransactionsParams,
    transactionId?: string,
  ): Promise<any>;
}

export interface IDeleteTransactionRepository {
  execute(transactionId: string): Promise<any>;
}

export interface IUpdateTransactionRepository {
  execute(
    transactionId: string,
    params: UpdateTransactionsParams,
  ): Promise<any>;
}
