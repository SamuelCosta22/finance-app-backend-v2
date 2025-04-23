import { CreateUserController } from './create-user.controller.ts';

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user: any) {
      return user;
    }
  }

  it('should return 201 when creating a new user successfully', async () => {
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
    expect(result).toEqual({
      statusCode: 201,
      body: {
        createdUser: httpRequest.body,
      },
    });
  });

  it('should return 400 if first_name is not provided', async () => {
    //arange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        last_name: 'Costa',
        email: 'samuelcosta@gmail.com',
        password: '123456',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if last_name is not provided', async () => {
    //arange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Samuel',
        email: 'samuelcosta@gmail.com',
        password: '123456',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not provided', async () => {
    //arange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Samuel',
        last_name: 'Costa',
        password: '123456',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not valid', async () => {
    //arange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Samuel',
        last_name: 'Costa',
        email: 'samuelcosta',
        password: '123456',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    //arange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Samuel',
        last_name: 'Costa',
        email: 'samuelcosta@gmail.com',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is less than 6 characters', async () => {
    //arange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: 'Samuel',
        last_name: 'Costa',
        email: 'samuelcosta@gmail.com',
        password: '123',
      },
    };

    //act
    const result = await createUserController.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });
});
