export enum TransactionEnum {
  'EARNING',
  'EXPENSE',
  'INVESTMENT',
}

export type CreateTransactionsParams = {
  id?: string;
  user_id: string;
  name: string;
  date: Date;
  amount: number;
  type: TransactionEnum;
};
