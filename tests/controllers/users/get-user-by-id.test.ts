import { faker } from '@faker-js/faker';
import { GetUserByIdController } from '../../../src/controllers/users/get-user-by-id.controller.ts';

class GetUserByIdUseCaseStub {
  async execute(): Promise<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  } | null> {
    return {
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    };
  }
}

describe('Get User By Id Controller', () => {
  const makeSut = () => {
    //Switch Under Test
    const getUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return { getUserByIdUseCase, sut };
  };

  it('should return 200 if a user is found', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(200);
  });

  it('should return 400 if invalid id is provided', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute({ params: { userId: 'invalid_id' } });

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 404 if a user is not found', async () => {
    //assert
    const { getUserByIdUseCase, sut } = makeSut();
    jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValueOnce(null);

    //act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(404);
  });

  it('should return 500 if GetUserByIdUseCase throws', async () => {
    //arange
    const { getUserByIdUseCase, sut } = makeSut();
    jest
      .spyOn(getUserByIdUseCase, 'execute')
      .mockRejectedValueOnce(new Error());

    //act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    });

    //assert
    expect(result.statusCode).toBe(500);
  });
});
