import { ZodError } from 'zod';
import { EmailAlreadyInUseError } from '../../errors/user.ts';
import { updateUserChema } from '../../schemas/user.ts';
import { IUpdateUserRepository } from '../../types/repositories/users.repository.ts';
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  success,
} from '../helpers/index.ts';

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

      await updateUserChema.parseAsync(params);

      const updatedUser = await this.updateUserUseCase.execute(userId, params);

      const { statusCode, body } = success(updatedUser);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}
