import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { CreateUserController } from './create-user.controller.ts';
import { faker } from '@faker-js/faker';

class CreateUserUseCaseStub {
  async execute(user: any) {
    return user;
  }
}

describe('Create User Controller', () => {
  const makeSut = () => {
    //Switch Under Test
    const createUserUseCase = new CreateUserUseCaseStub();
    const sut = new CreateUserController(createUserUseCase);

    return { createUserUseCase, sut };
  };

  it('should return 201 when creating a new user successfully', async () => {
    //arrange
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    //act
    const result = await sut.execute(httpRequest);

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
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    //act
    const result = await sut.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if last_name is not provided', async () => {
    //arange
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    //act
    const result = await sut.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not provided', async () => {
    //arange
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    //act
    const result = await sut.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if email is not valid', async () => {
    //arange
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: 'invalid_email',
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    //arange
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      },
    };

    //act
    const result = await sut.execute(httpRequest as any);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if password is less than 6 characters', async () => {
    //arange
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 3,
        }),
      },
    };

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });

  it('should call CreateUserUseCase with correct params', async () => {
    //arange
    const { createUserUseCase, sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    const executeSpy = jest.spyOn(createUserUseCase, 'execute');

    //act
    await sut.execute(httpRequest);

    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if CreateUserUseCase throws', async () => {
    //arange
    const { createUserUseCase, sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(500);
  });

  it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
    //arange
    const { createUserUseCase, sut } = makeSut();

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    };

    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(httpRequest.body.email);
    });

    //act
    const result = await sut.execute(httpRequest);

    //assert
    expect(result.statusCode).toBe(400);
  });
});
