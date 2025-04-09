import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { IUpdateUserRepository } from '../../repositories/postgres/users/update-user.repository.ts';
import {
  badRequest,
  checkIfEmailIsValid,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  serverError,
  success,
} from './helpers/index.ts';

export class UpdateUserController {
  constructor(private updateUserUseCase: IUpdateUserRepository) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = checkIfIdIsValid(userId);
      if (!isIdValid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      const allowedFields = ['first_name', 'last_name', 'email', 'password'];
      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      );

      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some provided field is not allowed.' });
      }

      if (params.password) {
        const passwordIdValid = checkIfPasswordIsValid(params.password);
        if (!passwordIdValid) {
          return invalidPasswordResponse();
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email);
        if (!emailIsValid) {
          return emailIsAlreadyInUseResponse();
        }
      }

      const someFieldIsBlank = Object.keys(params).some(
        (field) => params[field].trim().length === 0,
      );
      if (someFieldIsBlank) {
        return badRequest({ message: 'Some provided field is blank' });
      }

      const updatedUser = this.updateUserUseCase.execute(userId, params);

      const { statusCode, body } = success(updatedUser);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}
