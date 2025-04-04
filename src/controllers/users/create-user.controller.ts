import { CreateUserParams } from '../../types/users/CreateUserParams.ts';
import { CreateUserUseCase } from '../../usecases/users/create-user.usecase.ts';
import validator from 'validator';
import { badRequest, created, serverError } from '../helpers.ts';
import { PostgresCompareEmail } from '../../repositories/postgres/users/compare-email.repository.ts';

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
          return badRequest({ message: `Missing param: ${field}` });
        }

        if (params.password.length < 6) {
          return badRequest({
            message: 'Password must be at least 6 characters',
          });
        }

        const emailIsValid = validator.isEmail(params.email);
        if (!emailIsValid) {
          return badRequest({
            message: 'Invalid email. Please provide a valid one.',
          });
        }

        const postgresCompareEmail = new PostgresCompareEmail();
        const emailExistsResult = await postgresCompareEmail.execute(
          params.email,
        );
        const emailExists = emailExistsResult[0].exists;
        if (emailExists) {
          return badRequest({
            message: 'Email already in use. Please choose another one.',
          });
        }
      }

      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      return created({ createdUser });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
