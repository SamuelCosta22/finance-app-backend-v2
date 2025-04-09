import { CreateTransactionsParams } from '../transactions/CreateTransactionParams.ts';

export interface ICreateTransactionRepository {
  execute(params: CreateTransactionsParams): Promise<any>;
}
