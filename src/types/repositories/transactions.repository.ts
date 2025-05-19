import {
  CreateTransactionsParams,
  UpdateTransactionsParams,
} from '../transactions/CreateTransactionParams.ts';

export interface IGetTransactionsByUserIdRepository {
  execute(userId: string, from: Date, to: Date): Promise<any>;
}

export interface IGetTransactionByIdRepository {
  execute(transactionId: string): Promise<any>;
}

export interface ICreateTransactionRepository {
  execute(
    params: CreateTransactionsParams,
    transactionId?: string,
  ): Promise<any>;
}

export interface IDeleteTransactionRepository {
  execute(transactionId: string, userId?: string): Promise<any>;
}

export interface IUpdateTransactionRepository {
  execute(
    transactionId: string,
    params: UpdateTransactionsParams,
  ): Promise<any>;
}
