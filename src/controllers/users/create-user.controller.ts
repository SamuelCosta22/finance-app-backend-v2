import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { ICreateUserRepository } from '../../types/repositories/users.repository.ts';
import { CreateUserParams } from '../../types/users/CreateUserParams.ts';
import {
  badRequest,
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  created,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
  serverError,
  validateRequiredFields,
} from './helpers/index.ts';

export type HttpRequest = {
  body: CreateUserParams;
};

export class CreateUserController {
  constructor(private createUserUseCase: ICreateUserRepository) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest: HttpRequest) {
    try {
      const params = httpRequest.body;

      const requiredFields = ['first_name', 'last_name', 'email', 'password'];

      const { missingField, success } = validateRequiredFields(
        params,
        requiredFields,
      );

      if (!success) {
        return badRequest({ message: `Missing param: ${missingField}` });
      }

      const passwordIsValid = checkIfPasswordIsValid(params.password);
      if (!passwordIsValid) {
        return invalidPasswordResponse();
      }

      const emailIsValid = checkIfEmailIsValid(params.email);
      if (!emailIsValid) {
        return emailIsAlreadyInUseResponse();
      }

      const createdUser = await this.createUserUseCase.execute(params);

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
