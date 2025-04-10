import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { IUpdateUserRepository } from '../../types/repositories/users.repository.ts';
import {
  badRequest,
  checkIfIdIsValid,
  emailIsAlreadyInUseResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  serverError,
  success,
} from '../helpers/index.ts';
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
} from '../helpers/users-validators.ts';

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

      const updatedUser = await this.updateUserUseCase.execute(userId, params);

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
