import { faker } from '@faker-js/faker';
import { TransactionEnum } from '../../../generated/prisma/client.js';
import { DeleteTransactionUseCase } from '../../../src/usecases/transactions/delete-transaction.usecase.ts';

const transaction = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  name: faker.person.fullName(),
  date: faker.date.anytime(),
  amount: Number(faker.finance.amount()),
  type: TransactionEnum.EARNING,
};

class DeleteTransactionRepositoryStub {
  async execute(transactionId: string) {
    return {
      ...transaction,
      id: transactionId,
    };
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
    expect(result).toEqual({ ...transaction, id: transaction.id });
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
