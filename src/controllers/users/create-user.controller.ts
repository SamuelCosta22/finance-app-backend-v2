import { CreateUserParams } from '../../types/users/CreateUserParams.ts';
import { CreateUserUseCase } from '../../usecases/users/create-user.usecase.ts';
import validator from 'validator';

type HttpRequest = {
  body: CreateUserParams;
};

export class CreateUserController {
  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;
      type ParamsKeys = keyof typeof params;

      const requiredFields = ['first_name', 'last_name', 'email', 'password'];
      for (const field of requiredFields) {
        if (
          !params[field as ParamsKeys] ||
          params[field as ParamsKeys]?.trim().length === 0
        ) {
          return {
            statusCode: 400,
            body: {
              errorMessage: `Missing param: ${field}`,
            },
          };
        }

        if (params.password.length < 6) {
          return {
            statusCode: 400,
            body: {
              errorMessage: 'Password must be at least 6 characters',
            },
          };
        }

        const emailIsValid = validator.isEmail(params.email);
        if (!emailIsValid) {
          return {
            statusCode: 400,
            body: {
              errorMessage: 'Invalid email. Please provide a valid one.',
            },
          };
        }
      }

      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      return {
        statusCode: 201,
        body: createdUser,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: {
          errorMessage: 'Internal server error',
        },
      };
    }
  }
}
