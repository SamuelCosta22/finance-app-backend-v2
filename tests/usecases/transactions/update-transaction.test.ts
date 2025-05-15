import { faker } from '@faker-js/faker';
import { UpdateTransactionUseCase } from '../../../src/usecases/transactions/update-transaction.usecase.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { jest } from '@jest/globals';

class UpdateTransactionRepositoryStub {
  async execute() {
    return transaction;
  }
}

class GetTransactionByIdStub {
  async execute() {
    return transaction;
  }
}

describe('Update Transaction Use Case', () => {
  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const getTransactionByIdRepository = new GetTransactionByIdStub();
    const sut = new UpdateTransactionUseCase(
      updateTransactionRepository,
      getTransactionByIdRepository,
    );

    return { updateTransactionRepository, sut };
  };

  it('should update transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(transaction.id, {
      amount: Number(faker.finance.amount()),
    });

    //assert
    expect(result).toEqual(transaction);
  });

  it('should call UpdateTransactionRepository with correct params', async () => {
    //arrange
    const { updateTransactionRepository, sut } = makeSut();
    const updateTransactionRepositorySpy = jest.spyOn(
      updateTransactionRepository,
      'execute',
    );

    //act
    await sut.execute(transaction.id, {
      amount: transaction.amount,
    });

    //assert
    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
      transaction.id,
      {
        amount: transaction.amount,
      },
    );
  });

  it('should throw if UpdateTransactionRepository throws', async () => {
    //arrange
    const { updateTransactionRepository, sut } = makeSut();
    jest
      .spyOn(updateTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(transaction.id, {
      amount: transaction.amount,
    });

    //assert
    await expect(promise).rejects.toThrow();
  });
});
