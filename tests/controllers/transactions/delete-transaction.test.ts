import { faker } from '@faker-js/faker';
import { DeleteTransactionController } from '../../../src/controllers/transactions/delete-transaction.controller.ts';
import { TransactionEnum } from '../../../src/types/transactions/CreateTransactionParams.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { TransactionNotFoundError } from '../../../src/errors/transaction.ts';

class DeleteTransactionUseCaseStub {
  async execute(): Promise<{
    user_id: string;
    id: string;
    name: string;
    date: Date;
    type: TransactionEnum;
    amount: number;
  } | null> {
    return transaction;
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
      .mockRejectedValueOnce(new TransactionNotFoundError(faker.string.uuid()));

    //act
    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 when DeleteTransactionUseCase Throws', async () => {
    //arrange
    const { deleteTransactionUseCaseStub, sut } = makeSut();
    jest
      .spyOn(deleteTransactionUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should call DeleteTransactionUseCase with correct params', async () => {
    //arrange
    const { deleteTransactionUseCaseStub, sut } = makeSut();
    const executeSpy = jest.spyOn(deleteTransactionUseCaseStub, 'execute');

    const transactionId = faker.string.uuid();
    //act
    await sut.execute({
      params: {
        transactionId,
      },
    });

    //assert
    expect(executeSpy).toHaveBeenCalledWith(transactionId);
  });
});
