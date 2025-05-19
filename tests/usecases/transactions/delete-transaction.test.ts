import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from '../../../src/usecases/transactions/delete-transaction.usecase.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { jest } from '@jest/globals';

const user_id = faker.string.uuid();

class DeleteTransactionRepositoryStub {
  async execute() {
    return { ...transaction, user_id };
  }
}

class GetTransactionByIdStub {
  async execute() {
    return { ...transaction, user_id };
  }
}

describe('Create Transaction Use Case', () => {
  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const getTransactionByIdRepository = new GetTransactionByIdStub();
    const sut = new DeleteTransactionUseCase(
      deleteTransactionRepository,
      getTransactionByIdRepository,
    );

    return {
      deleteTransactionRepository,
      getTransactionByIdRepository,
      sut,
    };
  };

  it('should delete transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(transaction.id, user_id);

    //assert
    expect(result).toEqual({ ...transaction, user_id });
  });

  it('should call DeleteTransactionRepository with correct params', async () => {
    //arrange
    const { deleteTransactionRepository, sut } = makeSut();
    const deleteTransactionRepositorySpy = jest.spyOn(
      deleteTransactionRepository,
      'execute',
    );

    //act
    await sut.execute(transaction.id, user_id);

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
    const promise = sut.execute(transaction.id, user_id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
