import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../src/types/transactions/CreateTransactionParams.ts';

export const transaction = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  name: faker.person.fullName(),
  date: faker.date.anytime(),
  amount: Number(faker.finance.amount()),
  type: TransactionEnum.EARNING,
};
