import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from '../../../src/usecases/users/get-user-by-id.usecase.ts';

const user = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: 7,
  }),
};

class GetUserByIdRepositoryStub {
  async execute(): Promise<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  } | null> {
    return user;
  }
}

describe('Get User By Id Use Case', () => {
  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return { getUserByIdRepository, sut };
  };

  it('should get user by id successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(faker.string.uuid());

    //assert
    expect(result).toEqual(user);
  });

  it('should call GetUserByIdRepository with correct params', async () => {
    //arrange
    const { getUserByIdRepository, sut } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
    const userId = faker.string.uuid();

    //act
    await sut.execute(userId);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
