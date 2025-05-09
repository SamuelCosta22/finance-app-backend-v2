import { UserNotFoundError } from '../../../src/errors/user.ts';
import { CreateTransactionUseCase } from '../../../src/usecases/transactions/create-transaction.usecase.ts';
import { transaction } from '../../fixtures/transaction.ts';
import { user, UserEntity } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

const createTransactionParams = {
  ...transaction,
  id: undefined,
};

class CreateTransactionRepositoryStub {
  async execute() {
    return transaction;
  }
}

class GetUserByIdRepositoryStub {
  async execute(): Promise<UserEntity | null> {
    return { ...user };
  }
}

class IdGeneratorAdapterStub {
  execute(): string {
    return 'generated_id';
  }
}

describe('Create Transaction Use Case', () => {
  const makeSut = () => {
    //Switch Under Test
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    );

    return {
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
      sut,
    };
  };

  it('should create transaction successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(createTransactionParams);

    //assert
    expect(result).toEqual(transaction);
  });

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepository,
      'execute',
    );

    //act
    await sut.execute(createTransactionParams);

    //assert
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
      createTransactionParams.user_id,
    );
  });

  it('should call IdGeneratorAdapter', async () => {
    //arrange
    const { idGeneratorAdapter, sut } = makeSut();
    const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute');

    //act
    await sut.execute(createTransactionParams);

    //assert
    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  it('should call CreateTransactionRepository with correct params', async () => {
    //arrange
    const { createTransactionRepository, sut } = makeSut();
    const executeSpy = jest.spyOn(createTransactionRepository, 'execute');

    //act
    await sut.execute(createTransactionParams);

    //assert
    expect(executeSpy).toHaveBeenCalledWith({
      ...createTransactionParams,
      id: 'generated_id',
    });
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null);

    //act
    const promise = sut.execute(createTransactionParams);

    //assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(createTransactionParams.user_id),
    );
  });

  it('should throw if GetUserByIdRepository throws', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(createTransactionParams);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if IdGeneratorAdapter throws', async () => {
    //arrange
    const { idGeneratorAdapter, sut } = makeSut();
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const promise = sut.execute(createTransactionParams);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw if CreateTransactionRepository throws', async () => {
    //arrange
    const { createTransactionRepository, sut } = makeSut();
    jest
      .spyOn(createTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(createTransactionParams);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
