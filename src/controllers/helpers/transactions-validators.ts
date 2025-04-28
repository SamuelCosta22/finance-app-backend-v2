import { notFound } from './http.ts';

export const transactionNotFoundResponse = () => {
  return notFound({
    message: 'Transaction not found.',
  });
};
