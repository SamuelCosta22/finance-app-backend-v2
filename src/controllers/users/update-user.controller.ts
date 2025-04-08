import validator from 'validator';
import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { UpdateUserUseCase } from '../../usecases/users/update-user.usecase.ts';
import { badRequest, serverError, success } from './helpers/http.ts';
import {
  emailIsAlreadyInUseResponse,
  invalidIdResponse,
  invalidPasswordResponse,
} from './helpers/invalid-response.ts';
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
} from './helpers/validations.ts';

export class UpdateUserController {
  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = validator.isUUID(userId);
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

      const updateUserUseCase = new UpdateUserUseCase();
      const updatedUser = updateUserUseCase.execute(userId, params);

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
