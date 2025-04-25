import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';
import { DeleteTransactionController } from '../../../src/controllers/transactions/delete-transaction.controller.ts';

class DeleteTransactionUseCaseStub {
  async execute(): Promise<{
    user_id: string;
    id: string;
    name: string;
    date: Date;
    type: TransactionEnum;
    amount: number;
  } | null> {
    return {
      user_id: faker.string.uuid(),
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime(),
      type: TransactionEnum.INVESTMENT,
      amount: Number(faker.finance.amount()),
    };
  }
}

describe('Delete Transaction Controller', () => {
  const makeSut = () => {
    const deleteTransactionUseCaseStub = new DeleteTransactionUseCaseStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCaseStub);

    return { deleteTransactionUseCaseStub, sut };
  };

  it('should return 200 when transaction is deleted successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 when id provided is invalid', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      params: { transactionId: 'invalid_id' },
    });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 when transaction is not found', async () => {
    //arrange
    const { deleteTransactionUseCaseStub, sut } = makeSut();
    jest
      .spyOn(deleteTransactionUseCaseStub, 'execute')
      .mockResolvedValueOnce(null);

    //act
    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(404);
  });
});
