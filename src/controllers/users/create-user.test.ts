import { CreateUserController } from './create-user.controller.ts';

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user: any) {
      return user;
    }
  }

  it('Should return 201 when creating a new user successfully', async () => {
    //arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Samuel',
        last_name: 'Costa',
        email: 'samuelcosta@gmail.com',
        password: '123456',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(201);
    expect(result.body).not.toBeUndefined();
    expect(result.body).not.toBeNull();
  });
});
