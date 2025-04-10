import validator from 'validator';
import { TransactionEnum } from '../../../types/transactions/CreateTransactionParams.ts';

export const checkIfAmountIsValid = (amount: number) => {
  const amountString = amount.toFixed(2);
  return validator.isCurrency(amountString, {
    digits_after_decimal: [2],
    allow_negatives: false,
    decimal_separator: '.',
  });
};

export const checkIfTypeIsValid = (type: TransactionEnum) =>
  ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type);
