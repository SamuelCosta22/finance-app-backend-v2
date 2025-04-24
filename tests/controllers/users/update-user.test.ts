import { faker } from '@faker-js/faker';
import { UpdateUserController } from '../../../src/controllers/users/update-user.controller.ts';

class UpdateUserUseCaseStub {
  async execute(user: any) {
    return user;
  }
}

describe('Update User Controller', () => {
  const makeSut = () => {
    //Switch Under Test
    const updateUserUseCase = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCase);

    return { updateUserUseCase, sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  };

  it('should return 200 when updating a user successfully', async () => {
    //arrange
    const { sut } = makeSut();

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(200);
  });
});
