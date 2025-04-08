import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { CreateUserParams } from '../../types/users/CreateUserParams.ts';
import { CreateUserUseCase } from '../../usecases/users/create-user.usecase.ts';
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  badRequest,
  created,
  serverError,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
} from './helpers/index.ts';

export type HttpRequest = {
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

        const passwordIsValid = checkIfPasswordIsValid(params.password);
        if (!passwordIsValid) {
          return invalidPasswordResponse();
        }

        const emailIsValid = checkIfEmailIsValid(params.email);
        if (!emailIsValid) {
          return emailIsAlreadyInUseResponse();
        }
      }

      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      return created({ createdUser });
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      console.log(error);
      return serverError();
    }
  }
}
