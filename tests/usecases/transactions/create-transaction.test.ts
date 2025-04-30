import { faker } from '@faker-js/faker';
import {
  CreateTransactionsParams,
  TransactionEnum,
} from '../../../src/types/transactions/CreateTransactionParams.ts';
import { CreateTransactionUseCase } from '../../../src/usecases/transactions/create-transaction.usecase.ts';

const user = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 7,
  }),
};

const createTransactionParams = {
  user_id: faker.string.uuid(),
  name: faker.person.fullName(),
  date: faker.date.anytime(),
  amount: Number(faker.finance.amount()),
  type: TransactionEnum.EARNING,
};

class CreateTransactionRepositoryStub {
  async execute(transaction: CreateTransactionsParams) {
    return transaction;
  }
}

class GetUserByIdRepositoryStub {
  async execute(userId: string) {
    return { ...user, id: userId };
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
    expect(result).toEqual({ ...createTransactionParams, id: 'generated_id' });
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
});
