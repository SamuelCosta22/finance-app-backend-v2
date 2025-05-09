import { DeleteTransactionUseCase } from '../../../src/usecases/transactions/delete-transaction.usecase.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { jest } from '@jest/globals';

class DeleteTransactionRepositoryStub {
  async execute() {
    return transaction;
  }
}

describe('Create Transaction Use Case', () => {
  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

    return {
      deleteTransactionRepository,
      sut,
    };
  };

  it('should delete transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(transaction.id);

    //assert
    expect(result).toEqual(transaction);
  });

  it('should call DeleteTransactionRepository with correct params', async () => {
    //arrange
    const { deleteTransactionRepository, sut } = makeSut();
    const deleteTransactionRepositorySpy = jest.spyOn(
      deleteTransactionRepository,
      'execute',
    );

    //act
    await sut.execute(transaction.id);

    //assert
    expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(transaction.id);
  });

  it('should throw if DeleteTransactionRepository throws', async () => {
    //arrange
    const { deleteTransactionRepository, sut } = makeSut();
    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction.id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
