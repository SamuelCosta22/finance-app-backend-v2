import validator from 'validator';
import { UpdateUserUseCase } from '../../usecases/users/update-user.usecase.ts';
import { badRequest, serverError, success } from '../helpers.ts';
import { EmailAlreadyInUseError } from '../../errors/user.ts';

export class UpdateUserController {
  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const isIdValid = validator.isUUID(userId);
      if (!isIdValid) {
        return badRequest({
          message: 'The provided ID is not valid.',
        });
      }

      const updateUserParams = httpRequest.body;

      const allowedFields = ['first_name', 'last_name', 'email', 'password'];
      const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      );

      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some provided field is not allowed.' });
      }

      if (updateUserParams.password) {
        if (updateUserParams.password.length < 6) {
          return badRequest({
            message: 'Password must be at least 6 characters',
          });
        }
      }

      if (updateUserParams.email) {
        const emailIsValid = validator.isEmail(updateUserParams.email);
        if (!emailIsValid) {
          return badRequest({
            message: 'Invalid email. Please provide a valid one.',
          });
        }
      }

      const someFieldIsBlank = Object.keys(updateUserParams).some(
        (field) => updateUserParams[field].trim().length === 0,
      );
      if (someFieldIsBlank) {
        return badRequest({ message: 'Some provided field is blank' });
      }

      const updateUserUseCase = new UpdateUserUseCase();
      const updatedUser = updateUserUseCase.execute(userId, updateUserParams);

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
